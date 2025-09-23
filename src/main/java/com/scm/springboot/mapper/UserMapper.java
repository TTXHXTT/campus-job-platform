package com.scm.springboot.mapper;

import com.scm.springboot.entity.User;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface UserMapper {
    @Select("SELECT * FROM user WHERE username = #{username} AND password = #{password}")
    User login(String username, String password);
    
    @Select("SELECT * FROM user WHERE username = #{username}")
    User findByUsername(String username);
    
    @Select("SELECT * FROM user WHERE id = #{id}")
    User findById(Integer id);
    
    @Select("SELECT * FROM user WHERE type = #{type}")
    List<User> findByType(Integer type);
    
    @Select("SELECT * FROM user WHERE type = #{type} AND status = #{status}")
    List<User> findByTypeAndStatus(Integer type, Integer status);
    
    @Insert("INSERT INTO user(username, password, type, name, phone, avatar, status, create_time) VALUES(#{username}, #{password}, #{type}, #{name}, #{phone}, #{avatar}, #{status}, #{createTime})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(User user);
    
    @Update("UPDATE user SET status = #{status} WHERE id = #{id}")
    int updateStatus(Integer id, Integer status);
    
    @Update("UPDATE user SET name = #{name}, phone = #{phone}, avatar = #{avatar} WHERE id = #{id}")
    int updateInfo(User user);
} 