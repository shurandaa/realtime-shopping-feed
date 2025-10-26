package springbackend.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 产品信息 DTO - 对应前端 product 对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long id;
    private String title;      // 对应前端 product.title
    private String category;
    private Double price;      // 对应前端 product.price
    private List<String> images; // 对应前端 product.images
}