package springbackend.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 菜单推荐响应 - 返回9个产品
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuResponse {
    private List<ProductDTO> products;  // 9个推荐产品
    private String message;
}
