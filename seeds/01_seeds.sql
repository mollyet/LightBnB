INSERT INTO users (name, email, password)
VALUES ('Jimmy McDude', 'jimmy@dude.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Lola', 'lola@meow.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Dolly', 'dollyparton@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, number_of_beds, number_of_bathrooms, parking_spaces, country, province, city, street_address, postal_code, active)
VALUES (1, 'Dude Ranch', 'dude, a ranch!','thumb_img', 'cover_img', 100, 6, 3, 100, 'canada', 'British Columbia', 'Keremos', '123 Dude Way', 'V9J4X4', true),
(2, 'Cat Hotel','hotel for cats', 'thum_img', 'cover_img', 250, 3, 2, 1, 'canada',  'british columbia', 'vancouver', '15 West Georgia Street', 'V0L4O4', true),
(3, 'DollyWood','finest lodgings full of creepy dolls', 'thum_img', 'cover_img', 3000, 25, 20, 50, 'canada', 'alberta', 'banff', '404 Rocky Way', 'B3B6L6', true);

INSERT INTO reservations (start_date, end_date, guest_id, property_id)
VALUES ('2021-01-05','2021-01-25', 1, 3),
('2021-02-04', '2021-02-15', 2, 1),
('2020-11-07', '2021-01-11', 3, 2);

INSERT INTO property_reviews (reservation_id, guest_id, property_id, message, rating)
VALUES(1, 1, 3, 'twas great', 5),
(2, 2, 1, 'yikes', 1),
(3, 3, 2, 'full of spiders', 4);