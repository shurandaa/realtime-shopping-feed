package springbackend.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Security 配置 - 临时禁用认证(仅用于测试阶段)
 * 实现 JWT 认证后需要替换此配置
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())           // 禁用 CSRF (REST API 不需要)
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()            // 临时允许所有请求(测试用)
                );

        return http.build();
    }
}
