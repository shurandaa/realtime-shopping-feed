package springbackend.Entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * 购物车项 - 存储在 Redis 中
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItem implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long productId;      // 对应前端 product.id
    private String title;        // 对应前端 product.title
    private String category;
    private Double price;        // 对应前端 product.price
    private String image;        // 对应前端 product.images[0]
    private Integer quantity;
}