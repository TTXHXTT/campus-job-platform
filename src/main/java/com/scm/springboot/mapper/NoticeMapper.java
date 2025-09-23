package com.scm.springboot.mapper;

import com.scm.springboot.entity.Notice;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface NoticeMapper {
    @Select("SELECT nb.id, nb.title, nc.content, nc.image, nb.create_time FROM notice_base nb LEFT JOIN notice_content nc ON nb.id = nc.notice_id ORDER BY nb.create_time DESC")
    List<Notice> findAll();
    
    @Select("SELECT nb.id, nb.title, nc.content, nc.image, nb.create_time FROM notice_base nb LEFT JOIN notice_content nc ON nb.id = nc.notice_id WHERE nb.id = #{id}")
    Notice findById(Integer id);
    
    @Insert("INSERT INTO notice_base(title, create_time) VALUES(#{title}, #{createTime})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertBase(Notice notice);
    
    @Insert("INSERT INTO notice_content(notice_id, content, image) VALUES(#{id}, #{content}, #{image})")
    int insertContent(Notice notice);
    
    default int insert(Notice notice) {
        insertBase(notice);
        return insertContent(notice);
    }
    
    @Update({"UPDATE notice_base SET title = #{title} WHERE id = #{id};",
        "UPDATE notice_content SET content = #{content}, image = #{image} WHERE notice_id = #{id}"})
    int update(Notice notice);
    
    @Delete({"DELETE FROM notice_content WHERE notice_id = #{id};",
        "DELETE FROM notice_base WHERE id = #{id}"})
    int delete(Integer id);
} 