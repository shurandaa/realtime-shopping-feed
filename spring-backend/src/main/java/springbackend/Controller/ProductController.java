package springbackend.Controller;

import springbackend.DTO.ApiResponse;
import springbackend.DTO.ProductDetailResponse;
import springbackend.Service.ProductService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

/**
 * 产品控制器 - 对应前端 /product/:id 路由
 */
@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
@Slf4j
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * 获取产品详情 (包含描述和9张相关图片)
     * GET /api/products/{id}
     * Header: Authorization: Bearer <token>
     *
     * 对应前端路由: /product/:id
     */
    @GetMapping("/{id}")
    public ApiResponse<ProductDetailResponse> getProductDetail(
            @PathVariable Long id,
            // TODO: 从 JWT token 中获取 userId
            @RequestHeader(value = "X-User-Id", required = false, defaultValue = "1") Long userId) {

        log.info("Getting product detail for productId: {}, userId: {}", id, userId);

        try {
            ProductDetailResponse productDetail = productService.getProductDetail(id, userId);
            return ApiResponse.success(productDetail);
        } catch (Exception e) {
            log.error("Error getting product detail", e);
            return ApiResponse.error("Failed to get product detail: " + e.getMessage());
        }
    }
}