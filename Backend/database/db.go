package database

import (
	"database/sql"
	_"github.com/go-sql-driver/mysql"
	"log"
)

var DB *sql.DB

func ConnectDB(){
	var err error
	dsn := "root:vaibhav@tcp(localhost:3306)/learndb?parseTime=true"
	DB, err = sql.Open("mysql",dsn)
	if err !=nil {
		log.Fatal("mysql package connection error: ",err)
	}

	if err = DB.Ping(); err!=nil {
		log.Fatal("Database connectivity error :",err)
	}
	log.Printf("Database connected")
}