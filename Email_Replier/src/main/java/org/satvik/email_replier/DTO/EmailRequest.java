package org.satvik.email_replier.DTO;

import lombok.Data;

@Data
public class EmailRequest {
    private String emailContent;
    private String tone;
}
