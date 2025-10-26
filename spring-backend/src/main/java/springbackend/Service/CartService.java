package springbackend.Service;

import springbackend.DTO.BehaviorMessage;
import springbackend.DTO.ProductDetailResponse;
import springbackend.Entity.CartItem;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * 购物车服务
 */
@Service
@Slf4j
public class CartService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final RecommendEngineService recommendEngineService;

    private static final String CART_KEY_PREFIX = "cart:";
    private static final long CART_EXPIRATION_HOURS = 24;

    public CartService(RedisTemplate<String, Object> redisTemplate,
                       RecommendEngineService recommendEngineService) {
        this.redisTemplate = redisTemplate;
        this.recommendEngineService = recommendEngineService;
    }

    /**
     * 添加产品到购物车
     * 1. 从 Python 获取产品信息
     * 2. 加入 Redis 购物车
     * 3. 发送加购行为给 Python
     */
    public void addToCart(Long userId, Long productId) {
        log.info("Adding product {} to cart for user {}", productId, userId);

        // 1. 从 Python 获取产品信息
        ProductDetailResponse product = recommendEngineService.getProductDetail(productId);

        String cartKey = CART_KEY_PREFIX + userId;
        String itemKey = "product:" + productId;

        // 2. 检查购物车中是否已存在该产品
        CartItem existingItem = (CartItem) redisTemplate.opsForHash().get(cartKey, itemKey);

        if (existingItem != null) {
            // 如果已存在，增加数量
            existingItem.setQuantity(existingItem.getQuantity() + 1);
            redisTemplate.opsForHash().put(cartKey, itemKey, existingItem);
        } else {
            // 如果不存在，创建新的购物车项
            CartItem cartItem = CartItem.builder()
                    .productId(product.getId())
                    .title(product.getTitle())
                    .category(product.getCategory())
                    .price(product.getPrice())
                    .image(product.getImages() != null && !product.getImages().isEmpty()
                            ? product.getImages().get(0)
                            : "")
                    .quantity(1)
                    .build();
            redisTemplate.opsForHash().put(cartKey, itemKey, cartItem);
        }

        // 设置过期时间
        redisTemplate.expire(cartKey, CART_EXPIRATION_HOURS, TimeUnit.HOURS);

        // 3. 发送加购行为给推荐引擎
        BehaviorMessage addToCartBehavior = BehaviorMessage.builder()
                .productId(product.getId())
                .title(product.getTitle())
                .category(product.getCategory())
                .action("ADD_TO_CART")
                .userId(userId)
                .build();
        recommendEngineService.sendBehavior(addToCartBehavior);

        log.info("Product {} added to cart successfully", productId);
    }

    /**
     * 获取购物车内容
     */
    public List<CartItem> getCart(Long userId) {
        log.info("Getting cart for user {}", userId);

        String cartKey = CART_KEY_PREFIX + userId;
        List<Object> items = redisTemplate.opsForHash().values(cartKey);

        List<CartItem> cartItems = new ArrayList<>();
        for (Object obj : items) {
            if (obj instanceof CartItem) {
                cartItems.add((CartItem) obj);
            }
        }

        log.info("Retrieved {} items from cart", cartItems.size());
        return cartItems;
    }

    /**
     * 购买 - 清空购物车并发送购买行为
     */
    public void purchase(Long userId) {
        log.info("Processing purchase for user {}", userId);

        // 获取购物车所有产品
        List<CartItem> cartItems = getCart(userId);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // 发送每个产品的购买行为给推荐引擎
        for (CartItem cartItem : cartItems) {
            BehaviorMessage purchaseBehavior = BehaviorMessage.builder()
                    .productId(cartItem.getProductId())
                    .title(cartItem.getTitle())
                    .category(cartItem.getCategory())
                    .action("PURCHASE")
                    .userId(userId)
                    .build();
            recommendEngineService.sendBehavior(purchaseBehavior);
        }

        // 清空购物车
        String cartKey = CART_KEY_PREFIX + userId;
        redisTemplate.delete(cartKey);

        log.info("Purchase completed and cart cleared for user {}", userId);
    }

    /**
     * 清空购物车
     */
    public void clearCart(Long userId) {
        log.info("Clearing cart for user {}", userId);
        String cartKey = CART_KEY_PREFIX + userId;
        redisTemplate.delete(cartKey);
    }

    /**
     * 更新购物车商品数量
     */
    public void updateQuantity(Long userId, Long productId, Integer quantity) {
        log.info("Updating quantity for product {} to {} for user {}", productId, quantity, userId);

        String cartKey = CART_KEY_PREFIX + userId;
        String itemKey = "product:" + productId;

        CartItem cartItem = (CartItem) redisTemplate.opsForHash().get(cartKey, itemKey);

        if (cartItem != null) {
            if (quantity <= 0) {
                // 数量为0或负数,删除该商品
                redisTemplate.opsForHash().delete(cartKey, itemKey);
            } else {
                cartItem.setQuantity(quantity);
                redisTemplate.opsForHash().put(cartKey, itemKey, cartItem);
            }
            redisTemplate.expire(cartKey, CART_EXPIRATION_HOURS, TimeUnit.HOURS);
        }
    }

    /**
     * 从购物车删除商品
     */
    public void removeFromCart(Long userId, Long productId) {
        log.info("Removing product {} from cart for user {}", productId, userId);

        String cartKey = CART_KEY_PREFIX + userId;
        String itemKey = "product:" + productId;

        redisTemplate.opsForHash().delete(cartKey, itemKey);
    }
}