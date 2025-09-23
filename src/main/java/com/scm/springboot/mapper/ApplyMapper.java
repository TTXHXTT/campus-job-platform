package com.scm.springboot.mapper;

import com.scm.springboot.entity.Apply;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface ApplyMapper {
    @Select("SELECT a.id, a.job_id, a.student_id, ast.status, a.create_time, j.title as job_title, u.name as student_name FROM apply_base a LEFT JOIN apply_status ast ON a.id = ast.apply_id LEFT JOIN job_base j ON a.job_id = j.id LEFT JOIN user u ON a.student_id = u.id WHERE a.job_id = #{jobId} ORDER BY a.create_time DESC")
    List<Apply> findByJobId(Integer jobId);
    
    @Select("SELECT a.id, a.job_id, a.student_id, COALESCE(ast.status, 0) as status, a.create_time, j.title as job_title, u.name as student_name FROM apply_base a LEFT JOIN apply_status ast ON a.id = ast.apply_id LEFT JOIN job_base j ON a.job_id = j.id LEFT JOIN user u ON a.student_id = u.id WHERE a.student_id = #{studentId} AND COALESCE(ast.status, 0) = 1 ORDER BY a.create_time DESC")
    List<Apply> findByStudentId(Integer studentId);
    
    @Select("SELECT a.id, a.job_id, a.student_id, ast.status, a.create_time FROM apply_base a LEFT JOIN apply_status ast ON a.id = ast.apply_id WHERE a.job_id = #{jobId} AND a.student_id = #{studentId}")
    Apply findByJobIdAndStudentId(Integer jobId, Integer studentId);

    @Select("SELECT a.id, a.job_id, a.student_id, ast.status, a.create_time FROM apply_base a LEFT JOIN apply_status ast ON a.id = ast.apply_id WHERE a.job_id = #{jobId} AND a.student_id = #{studentId}")
    List<Apply> findByJobIdAndStudentId2(Integer jobId, Integer studentId);
    
    @Insert("INSERT INTO apply_base(job_id, student_id, create_time) VALUES(#{jobId}, #{studentId}, #{createTime})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertBase(Apply apply);
    
    @Insert("INSERT INTO apply_status(apply_id, status) VALUES(#{id}, #{status})")
    int insertStatus(Apply apply);
    
    default int insert(Apply apply) {
        insertBase(apply);
        return insertStatus(apply);
    }
    
    @Update("UPDATE apply_status SET status = #{status} WHERE apply_id = #{id}")
    int updateStatus(Integer id, Integer status);
    
    @Delete({"DELETE FROM apply_status WHERE apply_id = #{id};",
        "DELETE FROM apply_base WHERE id = #{id}"})
    int delete(Integer id);
    
    @Select("SELECT a.id, a.job_id, a.student_id, ast.status, a.create_time, j.title as job_title, u.name as student_name FROM apply_base a LEFT JOIN apply_status ast ON a.id = ast.apply_id LEFT JOIN job_base j ON a.job_id = j.id LEFT JOIN user u ON a.student_id = u.id WHERE a.student_id = #{studentId} ORDER BY a.create_time DESC")
    List<Apply> findAllByStudentId(Integer studentId);
    
    @Select("SELECT a.id, a.job_id, a.student_id, ast.status, a.create_time, j.title as job_title, u.name as student_name FROM apply_base a LEFT JOIN apply_status ast ON a.id = ast.apply_id LEFT JOIN job_base j ON a.job_id = j.id LEFT JOIN user u ON a.student_id = u.id WHERE j.publisher_id = #{publisherId} ORDER BY a.create_time DESC")
    List<Apply> findAllByPublisherId(Integer publisherId);
    
    @Select("SELECT a.id, a.job_id, a.student_id, ast.status, a.create_time, j.title as job_title, u.name as student_name FROM apply_base a LEFT JOIN apply_status ast ON a.id = ast.apply_id LEFT JOIN job_base j ON a.job_id = j.id LEFT JOIN user u ON a.student_id = u.id WHERE a.id = #{id}")
    Apply findById(Integer id);
} 