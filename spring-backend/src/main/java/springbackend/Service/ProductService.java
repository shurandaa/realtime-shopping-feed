package springbackend.Service;

import springbackend.DTO.BehaviorMessage;
import springbackend.DTO.ProductDTO;
import springbackend.DTO.ProductDetailResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 产品服务 - 所有数据从 Python 引擎获取
 */
@Service
@Slf4j
public class ProductService {

    private final RecommendEngineService recommendEngineService;

    public ProductService(RecommendEngineService recommendEngineService) {
        this.recommendEngineService = recommendEngineService;
    }

    /**
     * 获取推荐菜单 (9个产品)
     */
    public List<ProductDTO> getMenuRecommendations(Long userId) {
        log.info("Getting menu recommendations for user: {}", userId);
        return recommendEngineService.getRecommendations(userId);
    }

    /**
     * 获取产品详情
     * 1. 从 Python 获取产品信息
     * 2. 发送点击行为给 Python
     * 3. 获取相关图片
     */
    public ProductDetailResponse getProductDetail(Long productId, Long userId) {
        log.info("Getting product detail for productId: {}, userId: {}", productId, userId);

        // 1. 从 Python 获取产品详情
        ProductDetailResponse product = recommendEngineService.getProductDetail(productId);

        // 2. 发送点击行为给推荐引擎
        BehaviorMessage clickBehavior = BehaviorMessage.builder()
                .productId(product.getId())
                .title(product.getTitle())
                .category(product.getCategory())
                .action("CLICK")
                .userId(userId)
                .build();
        recommendEngineService.sendBehavior(clickBehavior);

        // 3. 获取相关图片 (9张)
        List<String> relatedImages = recommendEngineService.getRelatedImages(productId);
        product.setRelatedImages(relatedImages);

        return product;
    }
}