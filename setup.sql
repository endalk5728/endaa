-- Create the admins table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create an index on the username for faster lookups

-- Create the categories table
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  meta_title VARCHAR(255),
  meta_description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Create the posts table
-- Create the posts table
CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  content LONGTEXT,
  url VARCHAR(255),
  url_label VARCHAR(100),
  meta_title VARCHAR(60),
  meta_description VARCHAR(160),
  meta_keywords VARCHAR(255),
  featured_image VARCHAR(255),
  author_id INT,
  status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  published_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  FOREIGN KEY (author_id) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create indexes for the posts table
CREATE INDEX idx_category_id ON posts(category_id);
CREATE INDEX idx_author_id ON posts(author_id);
CREATE INDEX idx_status ON posts(status);
CREATE INDEX idx_published_at ON posts(published_at);

-- Create the tags table
CREATE TABLE tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create post_tags junction table
CREATE TABLE post_tags (
  post_id INT,
  tag_id INT,
  PRIMARY KEY (post_id, tag_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
-- Existing tables (admins, categories, posts, tags, post_tags) remain the same

-- Create the branding table
CREATE TABLE branding (
  id INT AUTO_INCREMENT PRIMARY KEY,
  site_name VARCHAR(255) NOT NULL,
  logo_url VARCHAR(255),
  favicon_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the seo table for website-wide SEO settings
CREATE TABLE seo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  meta_title VARCHAR(60),
  meta_description VARCHAR(160),
  meta_keywords VARCHAR(255),
  og_title VARCHAR(60),
  og_description VARCHAR(160),
  og_image VARCHAR(255),
  twitter_card VARCHAR(15),
  google_analytics_id VARCHAR(20),
  bing_webmaster_id VARCHAR(32),
  robots_txt TEXT,
  sitemap_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the backlinks table
CREATE TABLE backlinks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  url VARCHAR(255) NOT NULL,
  anchor_text VARCHAR(255),
  target_url VARCHAR(255) NOT NULL,
  rel_attribute ENUM('follow', 'nofollow') DEFAULT 'follow',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 
CREATE TABLE advertisements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ad_name VARCHAR(255) NOT NULL,
  ad_type ENUM('google_ads', 'custom') NOT NULL,
  ad_code TEXT,
  placement ENUM('sidebar', 'footer', 'header'),
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- Modify the pages table to include footer placement
CREATE TABLE pages (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  content LONGTEXT,
  meta_title VARCHAR(60),
  meta_description VARCHAR(160),
  meta_keywords VARCHAR(255),
  status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  is_footer_page BOOLEAN DEFAULT FALSE,
  footer_order INT UNSIGNED,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Create indexes for the pages table
CREATE INDEX idx_page_status ON pages(status);
CREATE INDEX idx_page_slug ON pages(slug);
CREATE INDEX idx_footer_page ON pages(is_footer_page, footer_order);

-- About Us Table
CREATE TABLE about_us (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  content TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_updated_at (updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Social Media Table
CREATE TABLE social_media (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  platform ENUM('facebook', 'twitter', 'instagram', 'linkedin','telegram') NOT NULL,
  url VARCHAR(255) NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY idx_platform (platform),
  KEY idx_updated_at (updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copyright Table
CREATE TABLE copyright (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  copyright_text VARCHAR(255) NOT NULL,
  year YEAR NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_year (year),
  KEY idx_updated_at (updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Create indexes for the new tables
CREATE INDEX idx_backlink_url ON backlinks(url);
CREATE INDEX idx_backlink_target_url ON backlinks(target_url);
CREATE INDEX idx_backlink_active ON backlinks(is_active);


CREATE TABLE branding (
  id INT PRIMARY KEY AUTO_INCREMENT,
  logo_type ENUM('image', 'text') NOT NULL,
  logo_image VARCHAR(255),
  logo_text VARCHAR(255),
  favicon VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS banners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255),
        link VARCHAR(255),
        image_url VARCHAR(255),
        button_text VARCHAR(50),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )

CREATE TABLE subscribers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
