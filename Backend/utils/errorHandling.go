package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Success(c *gin.Context, data interface{}) {

	c.JSON(http.StatusOK, gin.H{
		"success":true,
		"data":data,
	})
}

func Falied(c *gin.Context,statusCode int,msg string) {
	
	c.JSON(statusCode, gin.H{
		"success":false,
		"error":msg,
	})
}
