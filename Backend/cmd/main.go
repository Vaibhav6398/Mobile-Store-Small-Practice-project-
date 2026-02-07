package main

import (
	routes "crud/AllRoutes"
	"crud/database"
	// "fmt"
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	// "golang.org/x/crypto/bcrypt"
)

func main() {
	database.ConnectDB()
	rows, err := database.DB.Query("SELECT userid, password FROM employee")
	if err != nil {
		log.Fatal("Error fetching users:", err)
	}
	defer rows.Close()

	
	server := gin.Default()
	
	server.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))
	
	routes.Routes(server)
	
	server.Run(":8080")



}























	// for rows.Next() {
	// 	var userid int
	// 	var password string
	// 	if err := rows.Scan(&userid, &password); err != nil {
	// 		log.Println("Error scanning row:", err)
	// 		continue
	// 	}
	// 	if len(password) == 60 && password[:4] == "$2a$" {
	// 		continue
	// 	}
	
	// 	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	// 	if err != nil {
	// 		log.Println("Error hashing password for userid", userid, ":", err)
	// 		continue
	// 	}
	
	// 	_, err = database.DB.Exec("UPDATE employee SET password=? WHERE userid=?", string(hashedPassword), userid)
	// 	if err != nil {
	// 		log.Println("Error updating password for userid", userid, ":", err)
	// 		continue
	// 	}
	
	// 	fmt.Println("Password updated for userid:", userid)
	// }
	
	// fmt.Println("All passwords hashed successfully!")