package springbackend.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 产品详情响应
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailResponse {
    private Long id;
    private String title;
    private String category;
    private String description;
    private Double price;
    private List<String> images;          // 主图片列表
    private List<String> relatedImages;   // 推荐引擎返回的相关图片(9张)
}
