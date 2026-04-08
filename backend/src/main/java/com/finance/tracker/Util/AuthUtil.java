package com.finance.tracker.Util;

import com.finance.tracker.entity.UserEntity;
import com.finance.tracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuthUtil {

    private final UserRepository userRepository;

    /**
     * Returns the authenticated user's internal userId (UUID string)
     * by looking up the email stored in the SecurityContext.
     */
    public String getCurrentUserId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Authenticated user not found: " + email));
        return user.getUserId();
    }
}
