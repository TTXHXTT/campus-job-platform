package com.scm.springboot.mapper;

import com.scm.springboot.entity.Salary;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface SalaryMapper {
    @Select("SELECT s.id, s.job_id, s.student_id, sd.amount, sd.status, s.create_time, j.title as job_title, u.name as student_name FROM salary_base s LEFT JOIN salary_detail sd ON s.id = sd.salary_id LEFT JOIN job_base j ON s.job_id = j.id LEFT JOIN user u ON s.student_id = u.id ORDER BY s.create_time DESC")
    List<Salary> findAll();
    
    @Select("SELECT s.id, s.job_id, s.student_id, sd.amount, sd.status, s.create_time, j.title as job_title, u.name as student_name FROM salary_base s LEFT JOIN salary_detail sd ON s.id = sd.salary_id LEFT JOIN job_base j ON s.job_id = j.id LEFT JOIN user u ON s.student_id = u.id WHERE s.job_id = #{jobId} ORDER BY s.create_time DESC")
    List<Salary> findByJobId(Integer jobId);
    
    @Select("SELECT s.id, s.job_id, s.student_id, sd.amount, sd.status, s.create_time, j.title as job_title, u.name as student_name FROM salary_base s LEFT JOIN salary_detail sd ON s.id = sd.salary_id LEFT JOIN job_base j ON s.job_id = j.id LEFT JOIN user u ON s.student_id = u.id WHERE s.student_id = #{studentId} ORDER BY s.create_time DESC")
    List<Salary> findByStudentId(Integer studentId);
    
    @Insert("INSERT INTO salary_base(job_id, student_id, create_time) VALUES(#{jobId}, #{studentId}, #{createTime})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertBase(Salary salary);
    
    @Insert("INSERT INTO salary_detail(salary_id, amount, status) VALUES(#{id}, #{amount}, #{status})")
    int insertDetail(Salary salary);
    
    default int insert(Salary salary) {
        insertBase(salary);
        return insertDetail(salary);
    }
    
    @Update("UPDATE salary_detail SET status = #{status} WHERE salary_id = #{id}")
    int updateStatus(Integer id, Integer status);
    
    @Select("SELECT s.id, s.job_id, s.student_id, sd.amount, sd.status, s.create_time, j.title as job_title, u.name as student_name FROM salary_base s LEFT JOIN salary_detail sd ON s.id = sd.salary_id LEFT JOIN job_base j ON s.job_id = j.id LEFT JOIN user u ON s.student_id = u.id WHERE j.publisher_id = #{publisherId} ORDER BY s.create_time DESC")
    List<Salary> findByPublisherId(Integer publisherId);
} 