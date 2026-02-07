package models  

type ProfileResponse struct {
	UserID int    `json:"userid"`
	Name   string `json:"name"`
	Role   string `json:"role"`
	Age    int    `json:"age"`
	Gender string `json:"gender"`
}