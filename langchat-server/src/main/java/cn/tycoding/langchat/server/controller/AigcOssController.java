package cn.tycoding.langchat.server.controller;

import cn.tycoding.langchat.biz.entity.AigcOss;
import cn.tycoding.langchat.biz.service.AigcOssService;
import cn.tycoding.langchat.common.utils.R;
import cn.tycoding.langchat.upms.utils.AuthUtil;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * @author tycoding
 * @since 2024/1/19
 */
@RequestMapping("/aigc/oss")
@RestController
@AllArgsConstructor
public class AigcOssController {

    private final AigcOssService aigcOssService;

    @GetMapping("/list")
    public R list() {
        List<AigcOss> list = aigcOssService.list(Wrappers.<AigcOss>lambdaQuery()
                .eq(AigcOss::getUserId, AuthUtil.getUserId())
                .orderByDesc(AigcOss::getCreateTime)
        );
        return R.ok(list);
    }

    @PostMapping("/upload")
    public R upload(MultipartFile file) {
        return R.ok(aigcOssService.upload(file, String.valueOf(AuthUtil.getUserId())));
    }

    @PutMapping
    public R update(@RequestBody AigcOss data) {
        aigcOssService.updateById(data);
        return R.ok();
    }

    @DeleteMapping("/{id}")
    public R delete(@PathVariable String id) {
        aigcOssService.removeById(id);
        return R.ok();
    }
}