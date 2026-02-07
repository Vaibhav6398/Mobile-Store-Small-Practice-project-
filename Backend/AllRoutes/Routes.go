package AllRoutes

import (
	"crud/controllers"
	"crud/middleware"

	"github.com/gin-gonic/gin"
)

func Routes(server *gin.Engine) {

	server.POST("/login", controllers.SelectUser)
	server.POST("/multiLogin",controllers.MultiLoginUser)
	server.POST("/multiLoginOtp",controllers.OtpVerify)
	server.POST("/signup", controllers.Add)
	server.POST("/forgotPassword", controllers.ForgotPassword)
	server.POST("/resetPassword", controllers.ResetPassword)
	
	
	auth := server.Group("/")
	auth.Use(middleware.AuthMiddleware())
	{
		auth.PUT("/profile",controllers.UpdateProfile)
		auth.GET("/profile", controllers.GetProfile)
		auth.GET("/showEmployee/:type",controllers.ShowUser)
		// auth.GET("/showAll", controllers.ShowAll)
		// auth.GET("/showActive", controllers.ShowActive)
		// auth.GET("/showNonActive", controllers.ShowNonActive)		
		auth.DELETE("/user/:id", controllers.DeleteUser)
		auth.PATCH("/user/:id", controllers.RestoreUser)
		// auth.PUT("/user/:id", controllers.UpadateUser)
	}
}
