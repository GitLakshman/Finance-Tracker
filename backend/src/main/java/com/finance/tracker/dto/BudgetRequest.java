package com.finance.tracker.dto;

import com.finance.tracker.enums.Category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class BudgetRequest {

    @NotNull(message = "Category is required")
    private Category category;

    @NotNull(message = "Budget amount is required")
    @Positive(message = "Budget amount must be positive")
    private Double budgetAmount;

    @NotBlank(message = "Month is required")
    @Pattern(regexp = "\\d{4}-\\d{2}", message = "Month must be in YYYY-MM format")
    private String month;
}
