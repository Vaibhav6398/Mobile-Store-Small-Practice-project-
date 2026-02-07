package models

import (
	"database/sql"
)

type UserGet struct {
	UserId   int    `json:"userid" binding:"required"`
	UserName string `json:"name" binding:"required"`
	Password string `json:"password" binding:"required"`
	Age      int    `json:"age" binding:"required"`
	Gender   string `json:"gender" binding:"required"`
}

type UpdationUser struct {
	UserName string `json:"user_name"`
	Password string `json:"password"`
}

type UserShow struct {
	UserId    int          `json:"UserId"`
	UserName  string       `json:"UserName"`
	Age       int          `json:"Age"`
	Gender    string       `json:"Gender"`
	DeletedAt sql.NullTime `json:"DeletedAt"`
}

type GetS struct {
	UserId int `json:"user_id"`
}
