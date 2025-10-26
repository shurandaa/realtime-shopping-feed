package springbackend.Controller;

import springbackend.DTO.AddToCartRequest;
import springbackend.DTO.ApiResponse;
import springbackend.Entity.CartItem;
import springbackend.Service.CartService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 购物车控制器
 */
@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
@Slf4j
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    /**
     * 添加产品到购物车
     * POST /api/cart/add
     * Header: Authorization: Bearer <token>
     * Body: { "productId": 1 }
     */
    @PostMapping("/add")
    public ApiResponse<String> addToCart(
            @Valid @RequestBody AddToCartRequest request,
            // TODO: 从 JWT token 中获取 userId
            @RequestHeader(value = "X-User-Id", required = false, defaultValue = "1") Long userId) {

        log.info("Adding product {} to cart for user {}", request.getProductId(), userId);

        try {
            cartService.addToCart(userId, request.getProductId());
            return ApiResponse.success("Product added to cart successfully");
        } catch (Exception e) {
            log.error("Error adding product to cart", e);
            return ApiResponse.error("Failed to add product to cart: " + e.getMessage());
        }
    }

    /**
     * 获取购物车内容
     * GET /api/cart
     * Header: Authorization: Bearer <token>
     */
    @GetMapping
    public ApiResponse<List<CartItem>> getCart(
            @RequestHeader(value = "X-User-Id", required = false, defaultValue = "1") Long userId) {

        log.info("Getting cart for user {}", userId);

        try {
            List<CartItem> cartItems = cartService.getCart(userId);
            return ApiResponse.success(cartItems);
        } catch (Exception e) {
            log.error("Error getting cart", e);
            return ApiResponse.error("Failed to get cart: " + e.getMessage());
        }
    }

    /**
     * 购买 - 清空购物车
     * POST /api/cart/purchase
     * Header: Authorization: Bearer <token>
     */
    @PostMapping("/purchase")
    public ApiResponse<String> purchase(
            @RequestHeader(value = "X-User-Id", required = false, defaultValue = "1") Long userId) {

        log.info("Processing purchase for user {}", userId);

        try {
            cartService.purchase(userId);
            return ApiResponse.success("Purchase completed successfully");
        } catch (Exception e) {
            log.error("Error processing purchase", e);
            return ApiResponse.error("Failed to complete purchase: " + e.getMessage());
        }
    }

    /**
     * 更新购物车商品数量
     * PUT /api/cart/{productId}
     * Body: { "quantity": 2 }
     */
    @PutMapping("/{productId}")
    public ApiResponse<String> updateQuantity(
            @PathVariable Long productId,
            @RequestParam Integer quantity,
            @RequestHeader(value = "X-User-Id", required = false, defaultValue = "1") Long userId) {

        log.info("Updating quantity for product {} to {} for user {}", productId, quantity, userId);

        try {
            cartService.updateQuantity(userId, productId, quantity);
            return ApiResponse.success("Cart updated successfully");
        } catch (Exception e) {
            log.error("Error updating cart", e);
            return ApiResponse.error("Failed to update cart: " + e.getMessage());
        }
    }

    /**
     * 从购物车删除商品
     * DELETE /api/cart/{productId}
     */
    @DeleteMapping("/{productId}")
    public ApiResponse<String> removeFromCart(
            @PathVariable Long productId,
            @RequestHeader(value = "X-User-Id", required = false, defaultValue = "1") Long userId) {

        log.info("Removing product {} from cart for user {}", productId, userId);

        try {
            cartService.removeFromCart(userId, productId);
            return ApiResponse.success("Product removed from cart successfully");
        } catch (Exception e) {
            log.error("Error removing product from cart", e);
            return ApiResponse.error("Failed to remove product: " + e.getMessage());
        }
    }

    /**
     * 清空购物车
     * DELETE /api/cart
     */
    @DeleteMapping
    public ApiResponse<String> clearCart(
            @RequestHeader(value = "X-User-Id", required = false, defaultValue = "1") Long userId) {

        log.info("Clearing cart for user {}", userId);

        try {
            cartService.clearCart(userId);
            return ApiResponse.success("Cart cleared successfully");
        } catch (Exception e) {
            log.error("Error clearing cart", e);
            return ApiResponse.error("Failed to clear cart: " + e.getMessage());
        }
    }
}