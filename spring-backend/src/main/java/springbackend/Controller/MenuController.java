package springbackend.Controller;

import springbackend.DTO.ApiResponse;
import springbackend.DTO.ProductDTO;
import springbackend.DTO.MenuResponse;
import springbackend.Service.ProductService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 菜单推荐控制器 - 返回9个推荐产品
 */
@RestController
@RequestMapping("/api/menu")
@CrossOrigin(origins = "*")
@Slf4j
public class MenuController {

    private final ProductService productService;

    public MenuController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * 获取推荐菜单 (9个产品)
     * GET /api/menu
     * Header: Authorization: Bearer <token>
     */
    @GetMapping
    public ApiResponse<MenuResponse> getMenu(
            // TODO: 从 JWT token 中获取 userId
            @RequestHeader(value = "X-User-Id", required = false, defaultValue = "1") Long userId) {

        log.info("Received menu request from user: {}", userId);

        try {
            List<ProductDTO> recommendations = productService.getMenuRecommendations(userId);

            MenuResponse response = MenuResponse.builder()
                    .products(recommendations)
                    .message("Successfully retrieved recommendations")
                    .build();

            return ApiResponse.success(response);
        } catch (Exception e) {
            log.error("Error getting menu recommendations", e);
            return ApiResponse.error("Failed to get recommendations: " + e.getMessage());
        }
    }
}