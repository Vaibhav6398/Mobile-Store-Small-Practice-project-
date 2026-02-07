package controllers

import (
	"crud/database"
	"crud/utils"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func DeleteUser(c *gin.Context) {
	uid, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		utils.Falied(c, http.StatusBadRequest, "Send the correct formate request")
		return
	}

	query := `UPDATE employee SET deleted_at = NOW() WHERE userid=?`
	result, err := database.DB.Exec(query, uid)
	if err != nil {
		utils.Falied(c, 501, "Database executing query error ")
		return
	}
	rowAffected, err := result.RowsAffected()
	if err != nil {
		utils.Falied(c, http.StatusNotFound, "Unable to verify deletion")
		return
	} else if rowAffected == 0 {
		utils.Falied(c, http.StatusNotFound, "Userid is not in database")
		return
	}

	utils.Success(c, "User data deleted successfully")

}


func RestoreUser(c *gin.Context) {
	uid, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		utils.Falied(c, http.StatusBadRequest, "Send the correct formate request")
		return
	}

	query := `UPDATE employee SET deleted_at = NULL WHERE userid=?`
	result, err := database.DB.Exec(query, uid)
	if err != nil {
		utils.Falied(c, 501, "Database executing query error ")
		return
	}
	rowAffected, err := result.RowsAffected()
	if err != nil {
		utils.Falied(c, http.StatusNotFound, "Unable to verify restore")
		return
	} else if rowAffected == 0 {
		utils.Falied(c, http.StatusNotFound, "Userid is not in database")
		return
	}

	utils.Success(c, "User data deleted successfully")

}

func UpdateProfile(c *gin.Context) {
	var input struct {
		Name   string `json:"name" binding:"required"`
		Age    int    `json:"age" binding:"required,min=1"`
		Gender string `json:"gender" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		utils.Falied(c, http.StatusBadRequest, err.Error()) 
		return
	}

	userId, exists := c.Get("user_Id")
	if !exists {
		utils.Falied(c, http.StatusUnauthorized, "Unauthorized")
		return
	}
	fmt.Println("USER ID FROM CONTEXT 👉", userId)

	query := `
		UPDATE employee
		SET name = ?, age = ?, gender = ?
		WHERE userid = ?
	`

	_, err := database.DB.Exec(
		query,
		input.Name,
		input.Age,
		input.Gender,
		userId,
	)

	if err != nil {
		utils.Falied(c, http.StatusInternalServerError, "Database update failed")
		return
	}

	utils.Success(c, gin.H{
		"message": "Profile updated successfully",
	})
}
