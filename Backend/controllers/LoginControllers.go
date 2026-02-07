package controllers

import (
	"crud/database"
	// models "crud/models"
	"crud/utils"
	"net/http"
	// "strconv"
	"time"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var jwtKey = []byte("vaibhav")

func SelectUser(c *gin.Context) {
	var input struct {
		UserID   int    `json:"userid"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		utils.Falied(c, http.StatusBadRequest, "Invalid payload")
		return
	}

	var storedPassword, name string
	var uId int

	err := database.DB.QueryRow(
		"SELECT userid, name, password FROM employee WHERE userid=? and deleted_at IS NULL",
		input.UserID,
	).Scan(&uId, &name, &storedPassword)

	if err != nil {
		utils.Falied(c, http.StatusNotFound, "User not found")
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(storedPassword), []byte(input.Password))
	if err != nil {
		utils.Falied(c, http.StatusUnauthorized, "Incorrect password")
		return
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": uId,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	})

	tokenString, _ := token.SignedString(jwtKey)


	c.JSON(http.StatusOK, gin.H{
		"token":tokenString,
		"success": true,		
	})
}


func MultiLoginUser(c *gin.Context) {
	var input struct {
		UserID   int    `json:"userid"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		utils.Falied(c, http.StatusBadRequest, "Invalid payload")
		return
	}

	var storedPassword, name string
	var uId int

	err := database.DB.QueryRow(
		"SELECT userid, name, password FROM employee WHERE userid=? and deleted_at IS NULL",
		input.UserID,
	).Scan(&uId, &name, &storedPassword)

	if err != nil {
		utils.Falied(c, http.StatusNotFound, "User not found")
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(storedPassword), []byte(input.Password))
	if err != nil {
		utils.Falied(c, http.StatusUnauthorized, "Incorrect password")
		return
	}

	err = utils.GenerateOTP(uId)
	if err != nil {
		utils.Falied(c, 500, "Failed to generate OTP")
		return
	}

	// result, err := database.DB.Exec(
	// 	"UPDATE employee SET otp = ? WHERE userid = ?",
	// 	otp, input.UserID,
	// )

	// rows, _ := result.RowsAffected()
	// if err != nil || rows == 0 {
	// 	c.JSON(404, gin.H{"error": "User not found"})
	// 	return
	// }
	// token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
	// 	"user_id": uId,
	// 	"exp":     time.Now().Add(24 * time.Hour).Unix(),
	// })

	// tokenString, _ := token.SignedString(jwtKey)


	c.JSON(http.StatusOK, gin.H{
		"success": true,		
	})
}


func OtpVerify(c *gin.Context) {
	var input struct {
		UserID      int    `json:"userid"`
		OTP         string `json:"otp"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": "Invalid request"})
		return
	}

	var dbOTP string
	var expire time.Time
	err := database.DB.QueryRow(
		"SELECT otp,otp_expire_at FROM employee WHERE userid = ?",
		input.UserID,
	).Scan(&dbOTP,&expire)

	if err != nil {
		c.JSON(404, gin.H{"error": "User not found"})
		return
	}

	if dbOTP == "" || input.OTP != dbOTP {
		c.JSON(401, gin.H{"error": "Invalid OTP"})
		return
	}
	if time.Now().After(expire) {
		database.DB.Exec(
		"UPDATE employee SET otp = NULL,otp_expire_at= NULL WHERE userid = ?",
	 input.UserID,
	)
		utils.Falied(c, 401, "OTP Expire")
		return
	}
	result, err := database.DB.Exec(
		"UPDATE employee SET otp = NULL,otp_expire_at= NULL WHERE userid = ?",
		 input.UserID,
	)
	rows, _ := result.RowsAffected()
	if err != nil || rows == 0 {
		c.JSON(404, gin.H{"error": "User not found while deleting OTP"})
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": input.UserID,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	})

	tokenString, _ := token.SignedString(jwtKey)


	utils.Success(c,gin.H{
		"token":tokenString,	
	})
}





// func UpadateUser(c *gin.Context) {
// 	uid, err := strconv.ParseInt(c.Param("id"), 10, 64)

// 	if err != nil {
// 		utils.Falied(c, http.StatusBadRequest, "Send the correct formate request")
// 		return
// 	}

// 	data := models.UpdationUser{}

// 	err = c.ShouldBindJSON(&data)

// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{
// 			"message": "send request error",
// 		})
// 		return
// 	}

// 	query := `UPDATE employee SET  name=?, password=? WHERE userid=?`

// 	result, err := database.DB.Exec(query, data.UserName, data.Password, uid)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{
// 			"message": "Problem in updation",
// 		})
// 		return
// 	}

// 	rowAffected, err := result.RowsAffected()
// 	if err != nil {
// 		utils.Falied(c, http.StatusInternalServerError, "Unable to verify updation")
// 		return
// 	} else if rowAffected == 0 {
// 		utils.Falied(c, http.StatusInternalServerError, "Userid is not in database")
// 		return
// 	}
// 	c.JSON(200, gin.H{
// 		"message": "Data Updated",
// 	})

// }
