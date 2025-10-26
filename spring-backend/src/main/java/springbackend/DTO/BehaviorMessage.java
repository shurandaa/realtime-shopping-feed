package springbackend.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 发送给推荐引擎的行为消息
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BehaviorMessage {
    private Long productId;      // 对应前端 product.id
    private String title;        // 对应前端 product.title
    private String category;
    private String action;       // "ADD_TO_CART", "PURCHASE", "CLICK"
    private Long userId;         // 用户ID,用于个性化推荐
}