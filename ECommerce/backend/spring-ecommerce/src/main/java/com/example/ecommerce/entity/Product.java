package com.example.ecommerce.entity;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.sql.Date;

@Entity
@Getter
@Setter
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    public Long id;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    public ProductCategory category;

    @Column(name = "sku")
    public String sku;

    @Column(name = "name")
    public String name;

    @Column(name = "description")
    public String description;

    @Column(name = "unit_price")
    public BigDecimal unitPrice;

    @Column(name = "image_url")
    public String imageURL;

    @Column(name = "alter_image_url")
    public String alterImageURL;

    @Column(name = "active")
    public Boolean active;

    @Column(name = "units_in_stock")
    public int unitsInStock;

    @Column(name = "date_created")
    @CreationTimestamp
    public Date createDate;

    @Column(name = "last_updated")
    @UpdateTimestamp
    public Date updateDate;
}
