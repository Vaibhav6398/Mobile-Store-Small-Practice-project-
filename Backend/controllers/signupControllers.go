package controllers

import (
	"crud/database"
	models "crud/models"
	"crud/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func Add(c *gin.Context) {
	data := models.UserGet{}

	err := c.ShouldBindJSON(&data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Data insertion formate error",
		})
		return
	}
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(data.Password), bcrypt.DefaultCost)
	if err != nil {
		utils.Falied(c, http.StatusInternalServerError, "Error in generating hashed password")
		return
	}

	query := `insert into employee (userid,name,password,age,gender) values (?,?,?,?,?)`

	_, err = database.DB.Exec(query, data.UserId, data.UserName, string(hashedPassword), data.Age, data.Gender)
	if err != nil {
		c.JSON(401, gin.H{
			"message": "User id exist already",
		})
		return
	}

	c.JSON(200, gin.H{
		"message": "Data inserted",
	})

}
