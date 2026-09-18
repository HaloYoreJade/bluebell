package logic

import (
	"bluebell/dao/mysql"
	"bluebell/models"
	"bluebell/pkg/snowflake"
	"errors"
)

func SignUp(p *models.ParamSignUp) (err error) {
	//判断用户存不存在
	var exist bool
	exist, err = mysql.CheckUserExist(p.Username)
	if err != nil {
		//数据库查询出错
		return err
	}
	if exist {
		return errors.New("用户已存在")
	}
	//生成userid
	userID := snowflake.GenID()
	//构造一个User实例
	u := models.User{
		UserID:   userID,
		Username: p.Username,
		Password: p.Password,
	}
	//密码加密

	//保存入数据库
	mysql.InsertUser()
	return
}
