package utils

import (
	"crud/database"
	"crypto/rand"
	"fmt"
	"math/big"
	"time"
)

func GenerateOTP(uId int) error {
	n, err := rand.Int(rand.Reader, big.NewInt(10000))
	if err != nil {
		return err
	}
	otp := fmt.Sprintf("%04d", n.Int64())
	otpExpiry := time.Now().Add(5 * time.Minute)
	result, err := database.DB.Exec(
		"UPDATE employee SET otp = ?,otp_expire_at=? WHERE userid = ?",
		otp, otpExpiry, uId,
	)

	rows, _ := result.RowsAffected()
	if err != nil || rows == 0 {
		return err
	}
	return nil
}
