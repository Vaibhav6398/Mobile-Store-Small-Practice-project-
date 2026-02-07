package controllers

import (
	"crud/database"
	"crud/utils"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func ForgotPassword(c *gin.Context) {
	var input struct {
		UserID int `json:"userid"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": "Invalid request"})
		return
	}

	err := utils.GenerateOTP(input.UserID)
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

	c.JSON(200, gin.H{
		"message": "OTP generated",
	})
}

func ResetPassword(c *gin.Context) {
	var input struct {
		UserID      int    `json:"userid"`
		OTP         string `json:"otp"`
		NewPassword string `json:"new_password"`
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
	).Scan(&dbOTP, &expire)

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

	hashed, _ := bcrypt.GenerateFromPassword(
		[]byte(input.NewPassword),
		bcrypt.DefaultCost,
	)

	database.DB.Exec(
		"UPDATE employee SET password = ?, otp = NULL,otp_expire_at= NULL WHERE userid = ?",
		hashed, input.UserID,
	)

	c.JSON(200, gin.H{"message": "Password reset successful"})
}
