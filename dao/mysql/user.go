package mysql

func CheckUserExist(username string) (bool, error) {
	sqlStr := `select count(user_id) from user where username=?`
	var count int
	err := db.Get(&count, sqlStr, username)
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func InsertUser() {

}
