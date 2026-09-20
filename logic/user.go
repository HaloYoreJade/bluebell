package logic

import (
	"bluebell/dao/mysql"
	"bluebell/models"
	"bluebell/pkg/jwt"
	"bluebell/pkg/snowflake"
)

func SignUp(p *models.ParamSignUp) error {
	//判断用户存不存在
	if err := mysql.CheckUserExist(p.Username); err != nil {
		return err
	}

	//生成userid
	userID := snowflake.GenID()
	//构造一个User实例
	u := models.User{
		UserID:   userID,
		Username: p.Username,
		Password: p.Password,
	}
	//保存入数据库
	return mysql.InsertUser(&u)
}

func Login(p *models.ParamLogin) (token string, err error) {
	user := &models.User{
		Username: p.Username,
		Password: p.Password,
	}

	//传递的是指针，因此能拿到userID
	if err := mysql.Login(user); err != nil {
		return "", err
	}
	//生成JWT
	return jwt.GenToken(user.UserID, user.Username)
}
