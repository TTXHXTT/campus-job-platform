package com.scm.springboot.controller;

import com.scm.springboot.entity.*;
import com.scm.springboot.mapper.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.HashMap;
import java.util.Map;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.math.BigDecimal;
import java.math.RoundingMode;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class ApiController {
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private NoticeMapper noticeMapper;
    @Autowired
    private JobMapper jobMapper;
    @Autowired
    private ApplyMapper applyMapper;
    @Autowired
    private CheckinMapper checkinMapper;
    @Autowired
    private SalaryMapper salaryMapper;

    private SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    // 用户登录
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody User user) {
        Map<String, Object> result = new HashMap<>();
        User dbUser = userMapper.login(user.getUsername(), user.getPassword());
        if (dbUser != null) {
            if (dbUser.getStatus() == 0) {
                result.put("code", 2);
                result.put("msg", "账号待审核");
            } else if (dbUser.getStatus() == 2) {
                result.put("code", 3);
                result.put("msg", "账号已禁用");
            } else {
                result.put("code", 0);
                result.put("msg", "登录成功");
                result.put("data", dbUser);
            }
        } else {
            result.put("code", 1);
            result.put("msg", "用户名或密码错误");
        }
        return result;
    }

    // 用户注册
    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody User user) {
        Map<String, Object> result = new HashMap<>();

        // 检查用户名是否已存在
        User existUser = userMapper.findByUsername(user.getUsername());
        if (existUser != null) {
            result.put("code", 2);
            result.put("msg", "用户名已存在");
            return result;
        }

        user.setCreateTime(sdf.format(new Date()));
        user.setStatus(user.getType() == 2 ? 0 : 1); // 发布者需要审核
        try {
            userMapper.insert(user);
            result.put("code", 0);
            result.put("msg", "注册成功");
        } catch (Exception e) {
            result.put("code", 1);
            result.put("msg", "注册失败");
        }
        return result;
    }

    // 更新用户信息
    @PostMapping("/updateUserInfo")
    public Map<String, Object> updateUserInfo(@RequestBody User user) {
        Map<String, Object> result = new HashMap<>();
        try {
            userMapper.updateInfo(user);
            result.put("code", 0);
            result.put("msg", "更新成功");
        } catch (Exception e) {
            result.put("code", 1);
            result.put("msg", "更新失败");
        }
        return result;
    }

    // 获取用户列表
    @GetMapping("/getUserList")
    public Map<String, Object> getUserList(@RequestParam Integer type, @RequestParam(required = false) Integer status) {
        Map<String, Object> result = new HashMap<>();
        try {
            List<User> list = status == null ? userMapper.findByType(type) : userMapper.findByTypeAndStatus(type, status);
            result.put("code", 0);
            result.put("msg", "获取成功");
            result.put("data", list);
        } catch (Exception e) {
            result.put("code", 1);
            result.put("msg", "获取失败");
        }
        return result;
    }

    // 更新用户状态
    @PostMapping("/updateUserStatus")
    public Map<String, Object> updateUserStatus(@RequestParam Integer id, @RequestParam Integer status) {
        Map<String, Object> result = new HashMap<>();
        try {
            userMapper.updateStatus(id, status);
            result.put("code", 0);
            result.put("msg", "更新成功");
        } catch (Exception e) {
            result.put("code", 1);
            result.put("msg", "更新失败");
        }
        return result;
    }

    // 获取公告列表
    @GetMapping("/getNoticeList")
    public Map<String, Object> getNoticeList() {
        Map<String, Object> result = new HashMap<>();
        try {
            List<Notice> list = noticeMapper.findAll();
            result.put("code", 0);
            result.put("msg", "获取成功");
            result.put("data", list);
        } catch (Exception e) {
            result.put("code", 1);
            result.put("msg", "获取失败");
        }
        return result;
    }

    // 获取公告详情
    @GetMapping("/getNoticeDetail")
    public Map<String, Object> getNoticeDetail(@RequestParam Integer id) {
        Map<String, Object> result = new HashMap<>();
        try {
            Notice notice = noticeMapper.findById(id);
            result.put("code", 0);
            result.put("msg", "获取成功");
            result.put("data", notice);
        } catch (Exception e) {
            result.put("code", 1);
            result.put("msg", "获取失败");
        }
        return result;
    }

    // 发布招聘信息
    @PostMapping("/publishJob")
    public Map<String, Object> publishJob(@RequestBody Job job) {
        Map<String, Object> result = new HashMap<>();
        job.setCreateTime(sdf.format(new Date()));
        job.setStatus(1);
        try {
            jobMapper.insert(job);
            result.put("code", 0);
            result.put("msg", "发布成功");
        } catch (Exception e) {
            result.put("code", 1);
            result.put("msg", "发布失败");
        }
        return result;
    }

    // 获取招聘信息列表
    @GetMapping("/getJobList")
    public Map<String, Object> getJobList(@RequestParam(required = false) Integer publisherId) {
        Map<String, Object> result = new HashMap<>();
        try {
            List<Job> list = publisherId == null ? jobMapper.findAll() : jobMapper.findByPublisherId(publisherId);
            result.put("code", 0);
            result.put("msg", "获取成功");
            result.put("data", list);
        } catch (Exception e) {
            result.put("code", 1);
            result.put("msg", "获取失败");
        }
        return result;
    }

    // 获取招聘信息详情
    @GetMapping("/getJobDetail")
    public Map<String, Object> getJobDetail(@RequestParam Integer id) {
        Map<String, Object> result = new HashMap<>();
        try {
            Job job = jobMapper.findById(id);
            result.put("code", 0);
            result.put("msg", "获取成功");
            result.put("data", job);
        } catch (Exception e) {
            result.put("code", 1);
            result.put("msg", "获取失败");
        }
        return result;
    }

    // 删除招聘信息
    @PostMapping("/deleteJob")
    public Map<String, Object> deleteJob(@RequestParam Integer id) {
        Map<String, Object> result = new HashMap<>();
        try {
            jobMapper.delete(id);
            result.put("code", 0);
            result.put("msg", "删除成功");
        } catch (Exception e) {
            result.put("code", 1);
            result.put("msg", "删除失败");
        }
        return result;
    }

    // 报名
    @PostMapping("/apply")
    public Map<String, Object> apply(@RequestBody Apply apply) {
        Map<String, Object> result = new HashMap<>();
        apply.setCreateTime(sdf.format(new Date()));
        apply.setStatus(0);
        try {
            Apply existApply = applyMapper.findByJobIdAndStudentId(apply.getJobId(), apply.getStudentId());
            if (existApply != null) {
                result.put("code", 2);
                result.put("msg", "已经报名过了");
                return result;
            }
            applyMapper.insert(apply);
            result.put("code", 0);
            result.put("msg", "报名成功");
        } catch (Exception e) {
            result.put("code", 1);
            result.put("msg", "报名失败");
        }
        return result;
    }

    // 获取报名列表
    @GetMapping("/getApplyList")
    public Map<String, Object> getApplyList(@RequestParam(required = false) Integer jobId, @RequestParam(required = false) Integer studentId) {
        Map<String, Object> result = new HashMap<>();
        try {
            List<Apply> list = null;
            if (jobId != null && studentId != null) {
                list = applyMapper.findByJobIdAndStudentId2(jobId, studentId);
            } else if (jobId != null) {
                list = applyMapper.findByJobId(jobId);
            } else if (studentId != null) {
                list = applyMapper.findByStudentId(studentId);
            }
            result.put("code", 0);
            result.put("msg", "获取成功");
            result.put("data", list);
        } catch (Exception e) {
            result.put("code", 1);
            result.put("msg", "获取失败");
        }
        return result;
    }

    // 更新报名状态
    @PostMapping("/updateApplyStatus")
    public Map<String, Object> updateApplyStatus(@RequestParam Integer id, @RequestParam Integer status) {
        Map<String, Object> result = new HashMap<>();
        try {
            applyMapper.updateStatus(id, status);
            result.put("code", 0);
            result.put("msg", "更新成功");
        } catch (Exception e) {
            result.put("code", 1);
            result.put("msg", "更新失败");
        }
        return result;
    }

    // 签到
    @PostMapping("/checkin")
    public Map<String, Object> checkin(@RequestBody Checkin checkin) {
        Map<String, Object> result = new HashMap<>();
        try {
            // 检查是否有进行中的工作
            Checkin ongoing = checkinMapper.findOngoing(checkin.getStudentId());
            if (ongoing != null) {
                result.put("code", 2);
                result.put("msg", "您有正在进行中的工作，请先完成当前工作");
                return result;
            }

            // 检查是否已报名且通过审核
            Apply apply = applyMapper.findByJobIdAndStudentId(checkin.getJobId(), checkin.getStudentId());
            if (apply == null || apply.getStatus() != 1) {
                result.put("code", 3);
                result.put("msg", "您未报名或报名未通过审核");
                return result;
            }

            checkin.setCheckinTime(sdf.format(new Date()));
            checkin.setCreateTime(sdf.format(new Date()));
            checkinMapper.insert(checkin);
            result.put("code", 0);
            result.put("msg", "签到成功");
        } catch (Exception e) {
            result.put("code", 1);
            result.put("msg", "签到失败");
        }
        return result;
    }

    // 签退
    @PostMapping("/checkout")
    public Map<String, Object> checkout(@RequestBody Map<String, Integer> params) {
        Map<String, Object> result = new HashMap<>();
        try {
            Integer jobId = params.get("jobId");
            Integer studentId = params.get("studentId");

            System.out.println("签退参数: jobId=" + jobId + ", studentId=" + studentId);

            if (jobId == null || studentId == null) {
                result.put("code", 1);
                result.put("msg", "参数错误");
                return result;
            }

            // 获取进行中的签到记录
            Checkin ongoing = checkinMapper.findOngoing(studentId);
            System.out.println("进行中的工作: " + ongoing);

            if (ongoing == null) {
                result.put("code", 2);
                result.put("msg", "没有找到进行中的工作");
                return result;
            }

            // 确保是同一个工作
            if (!ongoing.getJobId().equals(jobId)) {
                result.put("code", 3);
                result.put("msg", "工作ID不匹配");
                return result;
            }

            // 更新签退时间
            String checkoutTime = sdf.format(new Date());
            int updateResult = checkinMapper.updateCheckoutTime(ongoing.getId(), checkoutTime);
            System.out.println("更新签退时间结果: " + updateResult);

            // 计算工作时长和工资
            Job job = jobMapper.findById(jobId);
            if (job != null) {
                Date checkinTime = sdf.parse(ongoing.getCheckinTime());
                Date endTime = sdf.parse(checkoutTime);
                double hours = (endTime.getTime() - checkinTime.getTime()) / (1000.0 * 3600);
                BigDecimal salary = job.getSalary().multiply(new BigDecimal(hours)).setScale(2, RoundingMode.HALF_UP);

                System.out.println("工作时长: " + hours + "小时, 工资: " + salary);

                // 创建工资记录
                Salary salaryRecord = new Salary();
                salaryRecord.setJobId(jobId);
                salaryRecord.setStudentId(studentId);
                salaryRecord.setAmount(salary);
                salaryRecord.setStatus(0); // 待审核
                salaryRecord.setCreateTime(checkoutTime);
                int salaryResult = salaryMapper.insert(salaryRecord);
                System.out.println("创建工资记录结果: " + salaryResult);
            }

            result.put("code", 0);
            result.put("msg", "签退成功");
        } catch (Exception e) {
            System.out.println("签退异常: " + e.getMessage());
            e.printStackTrace();
            result.put("code", 1);
            result.put("msg", "签退失败: " + e.getMessage());
        }
        return result;
    }

    // 获取签到记录
    @GetMapping("/getCheckinList")
    public Map<String, Object> getCheckinList(@RequestParam(required = false) Integer jobId, @RequestParam(required = false) Integer studentId) {
        Map<String, Object> result = new HashMap<>();
        try {
            List<Checkin> list = null;
            if (jobId != null) {
                list = checkinMapper.findByJobId(jobId);
            } else if (studentId != null) {
                list = checkinMapper.findByStudentId(studentId);
            }
            result.put("code", 0);
            result.put("msg", "获取成功");
            result.put("data", list);
        } catch (Exception e) {
            result.put("code", 1);
            result.put("msg", "获取失败");
        }
        return result;
    }

    // 获取今日签到数
    @GetMapping("/getTodayCheckinCount")
    public Map<String, Object> getTodayCheckinCount() {
        Map<String, Object> result = new HashMap<>();
        try {
            int count = checkinMapper.countTodayCheckin();
            result.put("code", 0);
            result.put("msg", "获取成功");
            result.put("data", count);
        } catch (Exception e) {
            result.put("code", 1);
            result.put("msg", "获取失败");
        }
        return result;
    }

    // 提交工资记录
    @PostMapping("/submitSalary")
    public Map<String, Object> submitSalary(@RequestBody Salary salary) {
        Map<String, Object> result = new HashMap<>();
        salary.setCreateTime(sdf.format(new Date()));
        salary.setStatus(0);
        try {
            salaryMapper.insert(salary);
            result.put("code", 0);
            result.put("msg", "提交成功");
        } catch (Exception e) {
            result.put("code", 1);
            result.put("msg", "提交失败");
        }
        return result;
    }

    // 获取工资记录
    @GetMapping("/getSalaryList")
    public Map<String, Object> getSalaryList(@RequestParam(required = false) Integer jobId, @RequestParam(required = false) Integer studentId) {
        Map<String, Object> result = new HashMap<>();
        try {
            List<Salary> list = null;
            if (jobId != null) {
                list = salaryMapper.findByJobId(jobId);
            } else if (studentId != null) {
                list = salaryMapper.findByStudentId(studentId);
            } else {
                list = salaryMapper.findAll();
            }
            result.put("code", 0);
            result.put("msg", "获取成功");
            result.put("data", list);
        } catch (Exception e) {
            result.put("code", 1);
            result.put("msg", "获取失败");
        }
        return result;
    }

    // 更新工资记录状态
    @PostMapping("/updateSalaryStatus")
    public Map<String, Object> updateSalaryStatus(@RequestBody Salary salary) {
        Map<String, Object> result = new HashMap<>();
        try {
            salaryMapper.updateStatus(salary.getId(), salary.getStatus());
            result.put("code", 0);
            result.put("msg", "更新成功");
        } catch (Exception e) {
            result.put("code", 1);
            result.put("msg", "更新失败");
        }
        return result;
    }

    // 获取所有报名列表
    @GetMapping("/getAllApplyList")
    public Map<String, Object> getAllApplyList(@RequestParam(required = false) Integer studentId, @RequestParam(required = false) Integer publisherId) {
        Map<String, Object> result = new HashMap<>();
        try {
            List<Apply> applyList = null;
            if (studentId != null) {
                applyList = applyMapper.findAllByStudentId(studentId);
            } else if (publisherId != null) {
                applyList = applyMapper.findAllByPublisherId(publisherId);
            }

            result.put("code", 0);
            result.put("msg", "获取成功");
            result.put("data", applyList);
        } catch (Exception e) {
            result.put("code", 1);
            result.put("msg", "获取失败");
        }
        return result;
    }

    // 取消报名
    @PostMapping("/deleteApply")
    public Map<String, Object> deleteApply(@RequestParam Integer id) {
        Map<String, Object> result = new HashMap<>();
        try {
            // 检查报名状态
            Apply apply = applyMapper.findById(id);
            if (apply == null) {
                result.put("code", 2);
                result.put("msg", "报名记录不存在");
                return result;
            }

            if (apply.getStatus() != 0) {
                result.put("code", 3);
                result.put("msg", "只能取消待审核的报名");
                return result;
            }

            applyMapper.delete(id);
            result.put("code", 0);
            result.put("msg", "取消成功");
        } catch (Exception e) {
            result.put("code", 1);
            result.put("msg", "取消失败");
        }
        return result;
    }

    @GetMapping("/getStats")
    public Map<String, Object> getStats() {
        Map<String, Object> result = new HashMap<>();
        Map<String, Object> data = new HashMap<>();

        // 获取学生数量
        List<User> students = userMapper.findByType(1);
        data.put("studentCount", students.size());

        // 获取发布者数量
        List<User> publishers = userMapper.findByType(2);
        data.put("publisherCount", publishers.size());

        // 获取招聘信息数量
        List<Job> jobs = jobMapper.findAll();
        data.put("jobCount", jobs.size());

        // 获取今日签到数量
        int todayCheckinCount = checkinMapper.countTodayCheckin();
        data.put("todayCheckinCount", todayCheckinCount);

        result.put("code", 0);
        result.put("msg", "success");
        result.put("data", data);
        return result;
    }

    @GetMapping("/getLatestJobs")
    public Map<String, Object> getLatestJobs() {
        Map<String, Object> result = new HashMap<>();

        // 获取最新的10条招聘信息
        List<Job> jobs = jobMapper.findLatest();

        result.put("code", 0);
        result.put("msg", "success");
        result.put("data", jobs);
        return result;
    }

    @PostMapping("/notice/insert")
    public Map<String, Object> insertNotice(@RequestBody Notice notice) {
        Map<String, Object> result = new HashMap<>();
        try {
            noticeMapper.insert(notice);
            result.put("code", 0);
            result.put("msg", "success");
        } catch (Exception e) {
            result.put("code", 1);
            result.put("msg", "发布失败");
        }
        return result;
    }

    @PostMapping("/notice/delete")
    public Map<String, Object> deleteNotice(@RequestParam Integer id) {
        Map<String, Object> result = new HashMap<>();
        try {
            noticeMapper.delete(id);
            result.put("code", 0);
            result.put("msg", "success");
        } catch (Exception e) {
            result.put("code", 1);
            result.put("msg", "删除失败");
        }
        return result;
    }

    @GetMapping("/getPublisherSalaryList")
    public Map<String, Object> getPublisherSalaryList(@RequestParam Integer publisherId) {
        Map<String, Object> result = new HashMap<>();
        try {
            List<Salary> list = salaryMapper.findByPublisherId(publisherId);
            result.put("code", 0);
            result.put("msg", "获取成功");
            result.put("data", list);
        } catch (Exception e) {
            result.put("code", 1);
            result.put("msg", "获取失败");
        }
        return result;
    }
}
