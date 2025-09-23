package com.scm.springboot.mapper;

import com.scm.springboot.entity.Checkin;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface CheckinMapper {
    @Select("SELECT c.id, c.job_id, c.student_id, ct.checkin_time, ct.checkout_time, c.create_time, j.title as job_title, u.name as student_name FROM checkin_base c LEFT JOIN checkin_time ct ON c.id = ct.checkin_id LEFT JOIN job_base j ON c.job_id = j.id LEFT JOIN user u ON c.student_id = u.id WHERE c.job_id = #{jobId} ORDER BY c.create_time DESC")
    List<Checkin> findByJobId(Integer jobId);
    
    @Select("SELECT c.id, c.job_id, c.student_id, ct.checkin_time, ct.checkout_time, c.create_time, j.title as job_title, u.name as student_name FROM checkin_base c LEFT JOIN checkin_time ct ON c.id = ct.checkin_id LEFT JOIN job_base j ON c.job_id = j.id LEFT JOIN user u ON c.student_id = u.id WHERE c.student_id = #{studentId} ORDER BY c.create_time DESC")
    List<Checkin> findByStudentId(Integer studentId);
    
    @Select("SELECT c.id, c.job_id, c.student_id, ct.checkin_time, ct.checkout_time, c.create_time FROM checkin_base c LEFT JOIN checkin_time ct ON c.id = ct.checkin_id WHERE c.job_id = #{jobId} AND c.student_id = #{studentId} AND DATE(ct.checkin_time) = CURDATE() AND ct.checkout_time IS NULL")
    Checkin findTodayCheckin(Integer jobId, Integer studentId);
    
    @Select("SELECT c.id, c.job_id, c.student_id, ct.checkin_time, ct.checkout_time, c.create_time FROM checkin_base c LEFT JOIN checkin_time ct ON c.id = ct.checkin_id WHERE c.student_id = #{studentId} AND ct.checkout_time IS NULL ORDER BY ct.checkin_time DESC LIMIT 1")
    Checkin findOngoing(Integer studentId);
    
    @Insert("INSERT INTO checkin_base(job_id, student_id, create_time) VALUES(#{jobId}, #{studentId}, #{createTime})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertBase(Checkin checkin);
    
    @Insert("INSERT INTO checkin_time(checkin_id, checkin_time) VALUES(#{id}, #{checkinTime})")
    int insertTime(Checkin checkin);
    
    default int insert(Checkin checkin) {
        insertBase(checkin);
        return insertTime(checkin);
    }
    
    @Update("UPDATE checkin_time SET checkout_time = #{checkoutTime} WHERE checkin_id = #{id}")
    int updateCheckoutTime(Integer id, String checkoutTime);
    
    @Select("SELECT COUNT(*) FROM checkin_base c LEFT JOIN checkin_time ct ON c.id = ct.checkin_id WHERE DATE(ct.checkin_time) = CURDATE()")
    int countTodayCheckin();
} 