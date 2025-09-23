package com.scm.springboot.mapper;

import com.scm.springboot.entity.Job;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface JobMapper {
    @Select("SELECT j.id, j.publisher_id, j.title, jd.content, jd.salary, jd.address, jd.requirement, j.status, j.create_time, u.name as publisher_name FROM job_base j LEFT JOIN job_detail jd ON j.id = jd.job_id LEFT JOIN user u ON j.publisher_id = u.id ORDER BY j.create_time DESC")
    List<Job> findAll();
    
    @Select("SELECT j.id, j.publisher_id, j.title, jd.content, jd.salary, jd.address, jd.requirement, j.status, j.create_time, u.name as publisher_name FROM job_base j LEFT JOIN job_detail jd ON j.id = jd.job_id LEFT JOIN user u ON j.publisher_id = u.id ORDER BY j.create_time DESC LIMIT 10")
    List<Job> findLatest();
    
    @Select("SELECT j.id, j.publisher_id, j.title, jd.content, jd.salary, jd.address, jd.requirement, j.status, j.create_time, u.name as publisher_name FROM job_base j LEFT JOIN job_detail jd ON j.id = jd.job_id LEFT JOIN user u ON j.publisher_id = u.id WHERE j.id = #{id}")
    Job findById(Integer id);
    
    @Select("SELECT j.id, j.publisher_id, j.title, jd.content, jd.salary, jd.address, jd.requirement, j.status, j.create_time, u.name as publisher_name FROM job_base j LEFT JOIN job_detail jd ON j.id = jd.job_id LEFT JOIN user u ON j.publisher_id = u.id WHERE j.publisher_id = #{publisherId} ORDER BY j.create_time DESC")
    List<Job> findByPublisherId(Integer publisherId);
    
    @Insert("INSERT INTO job_base(publisher_id, title, status, create_time) VALUES(#{publisherId}, #{title}, #{status}, #{createTime})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertBase(Job job);
    
    @Insert("INSERT INTO job_detail(job_id, content, salary, address, requirement) VALUES(#{id}, #{content}, #{salary}, #{address}, #{requirement})")
    int insertDetail(Job job);
    
    default int insert(Job job) {
        insertBase(job);
        return insertDetail(job);
    }
    
    @Update({"UPDATE job_base SET title = #{title} WHERE id = #{id};",
        "UPDATE job_detail SET content = #{content}, salary = #{salary}, address = #{address}, requirement = #{requirement} WHERE job_id = #{id}"})
    int update(Job job);
    
    @Update("UPDATE job_base SET status = #{status} WHERE id = #{id}")
    int updateStatus(Integer id, Integer status);
    
    @Delete({"DELETE FROM job_detail WHERE job_id = #{id};",
        "DELETE FROM job_base WHERE id = #{id}"})
    int delete(Integer id);
} 