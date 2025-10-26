package springbackend.Service;

import springbackend.DTO.BehaviorMessage;
import springbackend.DTO.ProductDTO;
import springbackend.DTO.ProductDetailResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

/**
 * 推荐引擎服务 - 所有数据从 Python 获取
 */
@Service
@Slf4j
public class RecommendEngineService {

    private final RestTemplate restTemplate;

    @Value("${recommendation.engine.url}")
    private String engineUrl;

    public RecommendEngineService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * 获取推荐的9个产品 (Menu)
     * Python API: GET {engineUrl}/recommendations?userId={userId}
     * 返回: [{"id": 1, "title": "...", "category": "...", "price": 10.0, "images": ["url1"]}]
     */
    public List<ProductDTO> getRecommendations(Long userId) {
        log.info("Fetching recommendations from Python engine for user: {}", userId);

        try {
            String url = engineUrl + "/recommendations?userId=" + userId;

            ResponseEntity<List<ProductDTO>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<ProductDTO>>() {}
            );

            List<ProductDTO> products = response.getBody();
            log.info("Successfully fetched {} recommendations from Python", products != null ? products.size() : 0);
            return products;

        } catch (Exception e) {
            log.error("Error fetching recommendations from Python engine", e);
            // 返回 Mock 数据作为降级
            return getMockRecommendations();
        }
    }

    /**
     * 获取产品详情
     * Python API: GET {engineUrl}/products/{productId}
     * 返回: {"id": 1, "title": "...", "category": "...", "description": "...", "price": 10.0, "images": ["url1", "url2"]}
     */
    public ProductDetailResponse getProductDetail(Long productId) {
        log.info("Fetching product detail from Python engine for productId: {}", productId);

        try {
            String url = engineUrl + "/products/" + productId;

            ResponseEntity<ProductDetailResponse> response = restTemplate.getForEntity(
                    url,
                    ProductDetailResponse.class
            );

            ProductDetailResponse product = response.getBody();
            log.info("Successfully fetched product detail from Python: {}", product != null ? product.getTitle() : "null");
            return product;

        } catch (Exception e) {
            log.error("Error fetching product detail from Python engine", e);
            // 返回 Mock 数据作为降级
            return getMockProductDetail(productId);
        }
    }

    /**
     * 发送用户行为消息给推荐引擎
     * Python API: POST {engineUrl}/behavior
     * Body: {"productId": 1, "title": "...", "category": "...", "action": "CLICK", "userId": 1}
     */
    public void sendBehavior(BehaviorMessage message) {
        log.info("Sending behavior to Python engine: {}", message);

        try {
            String url = engineUrl + "/behavior";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<BehaviorMessage> request = new HttpEntity<>(message, headers);

            restTemplate.postForObject(url, request, Void.class);
            log.info("Behavior sent successfully to Python");

        } catch (Exception e) {
            log.error("Error sending behavior to Python engine", e);
            // 不抛出异常,避免影响主流程
        }
    }

    /**
     * 获取产品相关的9张图片
     * Python API: GET {engineUrl}/images?productId={productId}
     * 返回: ["url1", "url2", ..., "url9"]
     */
    public List<String> getRelatedImages(Long productId) {
        log.info("Fetching related images from Python engine for productId: {}", productId);

        try {
            String url = engineUrl + "/images?productId=" + productId;

            ResponseEntity<List<String>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<String>>() {}
            );

            List<String> images = response.getBody();
            log.info("Successfully fetched {} related images from Python", images != null ? images.size() : 0);
            return images;

        } catch (Exception e) {
            log.error("Error fetching related images from Python engine", e);
            // 返回 Mock 数据作为降级
            return getMockRelatedImages();
        }
    }

    // ==================== Mock 数据 (降级方案) ====================

    private List<ProductDTO> getMockRecommendations() {
        log.warn("Using mock recommendations data");
        List<ProductDTO> mockProducts = new ArrayList<>();
        for (int i = 1; i <= 9; i++) {
            mockProducts.add(ProductDTO.builder()
                    .id((long) i)
                    .title("Product " + i)
                    .category("Category " + (i % 3 + 1))
                    .price(10.0 + i)
                    .images(List.of("https://via.placeholder.com/300?text=Product+" + i))
                    .build());
        }
        return mockProducts;
    }

    private ProductDetailResponse getMockProductDetail(Long productId) {
        log.warn("Using mock product detail data for productId: {}", productId);
        return ProductDetailResponse.builder()
                .id(productId)
                .title("Product " + productId)
                .category("Category 1")
                .description("This is a detailed description for Product " + productId)
                .price(10.0 + productId)
                .images(List.of("https://via.placeholder.com/300?text=Product+" + productId))
                .relatedImages(getMockRelatedImages())
                .build();
    }

    private List<String> getMockRelatedImages() {
        log.warn("Using mock related images data");
        List<String> mockImages = new ArrayList<>();
        for (int i = 1; i <= 9; i++) {
            mockImages.add("https://via.placeholder.com/300?text=Related+" + i);
        }
        return mockImages;
    }
}