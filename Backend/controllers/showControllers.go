package controllers

import (
	"crud/database"
	models "crud/models"
	"crud/utils"

	// "database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
)

func ShowAll(c *gin.Context) {
	var allData []models.UserShow

	query := `SELECT userid, name, age, gender FROM employee`
	rows, err := database.DB.Query(query)
	if err != nil {
		utils.Falied(c, http.StatusInternalServerError, "Database error")
		return
	}
	defer rows.Close()

	for rows.Next() {
		var employee models.UserShow
		// var deletedAt sql.NullTime

		err := rows.Scan(
			&employee.UserId,
			&employee.UserName,
			&employee.Age,
			&employee.Gender,
		)
		if err != nil {
			utils.Falied(c, http.StatusInternalServerError, "Data scan error")
			return
		}

		// if deletedAt.Valid {
		// 	employee.DeletedAt = &deletedAt.Time
		// } else {
		// 	employee.DeletedAt = nil
		// }

		allData = append(allData, employee)
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Data fetched",
		"data":    allData,
	})
}

func ShowActive(c *gin.Context) {
	var allData []models.UserShow

	query := `SELECT userid, name,age,gender FROM employee WHERE deleted_at IS NULL`
	rows, err := database.DB.Query(query)
	if err != nil {
		utils.Falied(c, http.StatusInternalServerError, "Database error")
		return
	}
	defer rows.Close()

	for rows.Next() {
		var employee models.UserShow
		if err := rows.Scan(&employee.UserId, &employee.UserName, &employee.Age, &employee.Gender); err != nil {
			utils.Falied(c, http.StatusInternalServerError, "Data scan error")
			return
		}
		allData = append(allData, employee)
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Data fetched",
		"data":    allData,
	})
}

func ShowNonActive(c *gin.Context) {
	var allData []models.UserShow

	query := `SELECT userid, name,age,gender FROM employee WHERE deleted_at IS NOT NULL`
	rows, err := database.DB.Query(query)
	if err != nil {
		utils.Falied(c, http.StatusInternalServerError, "Database error")
		return
	}
	defer rows.Close()

	for rows.Next() {
		var employee models.UserShow
		if err := rows.Scan(&employee.UserId, &employee.UserName, &employee.Age, &employee.Gender); err != nil {
			utils.Falied(c, http.StatusInternalServerError, "Data scan error")
			return
		}
		allData = append(allData, employee)
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Data fetched",
		"data":    allData,
	})
}

func ShowUser(c *gin.Context) {
	var allData []models.UserShow
	mode := c.Param("type")
	var query string
	if mode == "Active" {
		query = `SELECT userid, name,age,gender,deleted_at FROM employee WHERE deleted_at IS NULL`
	} else if mode == "NonActive" {
		query = `SELECT userid, name,age,gender,deleted_at FROM employee WHERE deleted_at IS NOT NULL`
	} else {
		query = `SELECT userid, name, age,gender, deleted_at gender FROM employee`
	}

	rows, err := database.DB.Query(query)
	if err != nil {
		utils.Falied(c, http.StatusInternalServerError, "Database error")
		return
	}
	defer rows.Close()

	for rows.Next() {
		var employee models.UserShow
		if err := rows.Scan(&employee.UserId, &employee.UserName, &employee.Age, &employee.Gender, &employee.DeletedAt); err != nil {
			utils.Falied(c, http.StatusInternalServerError, "Data scan error")
			return
		}
		allData = append(allData, employee)
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Data fetched",
		"data":    allData,
	})
}

func GetProfile(c *gin.Context) {

	userId, exists := c.Get("user_Id")
	if !exists {
		utils.Falied(c, http.StatusUnauthorized, "Unauthorized")
		return
	}

	var user models.ProfileResponse

	query := `SELECT userid, name, role, age, gender FROM employee WHERE userid=?`
	err := database.DB.QueryRow(query, userId).Scan(
		&user.UserID,
		&user.Name,
		&user.Role,
		&user.Age,
		&user.Gender,
	)

	if err != nil {
		utils.Falied(c, http.StatusNotFound, "User not found")
		return
	}

	utils.Success(c, user)
}
