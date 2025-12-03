"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Check, Copy, CaretDown, CaretUp } from "@phosphor-icons/react"

// Category image options from Unsplash - multiple choices per category
const categoryImageOptions: Record<string, { url: string; description: string }[]> = {
  // HOME & KITCHEN - Multiple options
  "home": [
    { url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=200&h=200&fit=crop", description: "1. Modern white furniture" },
    { url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop", description: "2. Kitchen utensils" },
    { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&h=200&fit=crop", description: "3. Modern living room" },
    { url: "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=200&h=200&fit=crop", description: "4. Kitchen with plants" },
    { url: "https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=200&h=200&fit=crop", description: "5. Cozy living room" },
    { url: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=200&h=200&fit=crop", description: "6. Minimalist interior" },
    { url: "https://images.unsplash.com/photo-1565183997392-2f6f122e5912?w=200&h=200&fit=crop", description: "7. Kitchen pots" },
    { url: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=200&h=200&fit=crop", description: "8. Bedroom interior" },
  ],
  
  // FASHION - NEW OPTIONS
  "fashion": [
    { url: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=200&h=200&fit=crop", description: "1. Clothing on rack" },
    { url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&h=200&fit=crop", description: "2. Shopping bags woman" },
    { url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=200&h=200&fit=crop", description: "3. Fashion model pose" },
    { url: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=200&h=200&fit=crop", description: "4. Handbags display" },
    { url: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=200&h=200&fit=crop", description: "5. Sneakers collection" },
    { url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop", description: "6. Colorful sneakers" },
    { url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=200&h=200&fit=crop", description: "7. Nike shoes orange" },
    { url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=200&h=200&fit=crop", description: "8. Folded clothes neat" },
    { url: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop", description: "9. Fashion store racks" },
    { url: "https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=200&h=200&fit=crop", description: "10. Sunglasses stylish" },
    { url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&h=200&fit=crop", description: "11. Dress on hanger" },
    { url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&h=200&fit=crop", description: "12. Jacket fashion" },
  ],

  // ELECTRONICS
  "electronics": [
    { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop", description: "1. Headphones on yellow" },
    { url: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=200&h=200&fit=crop", description: "2. Tech gadgets flat lay" },
    { url: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=200&h=200&fit=crop", description: "3. White headphones" },
    { url: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=200&h=200&fit=crop", description: "4. Laptop and phone" },
    { url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&h=200&fit=crop", description: "5. Multiple devices" },
    { url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop", description: "6. Macbook laptop" },
    { url: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=200&h=200&fit=crop", description: "7. iPhone close-up" },
    { url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=200&h=200&fit=crop", description: "8. Smartphone in hand" },
  ],

  // BEAUTY
  "beauty": [
    { url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop", description: "1. Makeup brushes" },
    { url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200&h=200&fit=crop", description: "2. Lipsticks collection" },
    { url: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=200&h=200&fit=crop", description: "3. Skincare products" },
    { url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop", description: "4. Perfume bottles" },
    { url: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=200&h=200&fit=crop", description: "5. Beauty products pink" },
    { url: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=200&h=200&fit=crop", description: "6. Lipstick close-up" },
    { url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=200&h=200&fit=crop", description: "7. Face cream jars" },
    { url: "https://images.unsplash.com/photo-1631730486572-226d1f595b68?w=200&h=200&fit=crop", description: "8. Makeup palette" },
  ],

  // GAMING
  "gaming": [
    { url: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=200&h=200&fit=crop", description: "1. PS5 controller" },
    { url: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=200&h=200&fit=crop", description: "2. Xbox controller green" },
    { url: "https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=200&h=200&fit=crop", description: "3. Gaming setup RGB" },
    { url: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=200&h=200&fit=crop", description: "4. Gaming headset" },
    { url: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=200&h=200&fit=crop", description: "5. Nintendo Switch" },
    { url: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=200&h=200&fit=crop", description: "6. Retro game controllers" },
    { url: "https://images.unsplash.com/photo-1586182987320-4f376d39d787?w=200&h=200&fit=crop", description: "7. Gaming keyboard RGB" },
    { url: "https://images.unsplash.com/photo-1625805866449-3589fe3f71a3?w=200&h=200&fit=crop", description: "8. Console controllers" },
  ],

  // SPORTS
  "sports": [
    { url: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200&h=200&fit=crop", description: "1. Soccer ball" },
    { url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop", description: "2. Gym dumbbells" },
    { url: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=200&h=200&fit=crop", description: "3. Running shoes" },
    { url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&h=200&fit=crop", description: "4. Yoga mat" },
    { url: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=200&h=200&fit=crop", description: "5. Basketball" },
    { url: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=200&h=200&fit=crop", description: "6. Tennis rackets" },
    { url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop", description: "7. Fitness weights" },
    { url: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=200&h=200&fit=crop", description: "8. Gym equipment" },
  ],

  // TOYS
  "toys": [
    { url: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=200&h=200&fit=crop", description: "1. Colorful toys" },
    { url: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=200&h=200&fit=crop", description: "2. Lego bricks" },
    { url: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=200&h=200&fit=crop", description: "3. Teddy bear" },
    { url: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=200&h=200&fit=crop", description: "4. Wooden toys" },
    { url: "https://images.unsplash.com/photo-1558679908-541bcf1249ff?w=200&h=200&fit=crop", description: "5. Toy car" },
    { url: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=200&h=200&fit=crop", description: "6. Action figures" },
    { url: "https://images.unsplash.com/photo-1596068587619-e4b11c7a3c3e?w=200&h=200&fit=crop", description: "7. Plush toys" },
    { url: "https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d?w=200&h=200&fit=crop", description: "8. Building blocks" },
  ],

  // BABY & KIDS
  "baby-kids": [
    { url: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=200&h=200&fit=crop", description: "1. Baby toys colorful" },
    { url: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=200&h=200&fit=crop", description: "2. Baby clothes" },
    { url: "https://images.unsplash.com/photo-1522771930-78b47f984683?w=200&h=200&fit=crop", description: "3. Baby shoes" },
    { url: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=200&h=200&fit=crop", description: "4. Baby stroller" },
    { url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=200&fit=crop", description: "5. Children books" },
    { url: "https://images.unsplash.com/photo-1566004100631-35d015d6a491?w=200&h=200&fit=crop", description: "6. Baby mobile" },
    { url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=200&h=200&fit=crop", description: "7. Playroom" },
    { url: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=200&h=200&fit=crop", description: "8. Kids toys" },
  ],

  // PETS
  "pets": [
    { url: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200&h=200&fit=crop", description: "1. Cute dog" },
    { url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop", description: "2. Golden retriever" },
    { url: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=200&h=200&fit=crop", description: "3. Dog toys" },
    { url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop", description: "4. Cat portrait" },
    { url: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200&h=200&fit=crop", description: "5. Pet food bowls" },
    { url: "https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=200&h=200&fit=crop", description: "6. Cat playing" },
    { url: "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=200&h=200&fit=crop", description: "7. Dog with leash" },
    { url: "https://images.unsplash.com/photo-1545529468-42764ef8c85f?w=200&h=200&fit=crop", description: "8. Pet accessories" },
  ],

  // BOOKS
  "books": [
    { url: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=200&h=200&fit=crop", description: "1. Stack of books" },
    { url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=200&fit=crop", description: "2. Library shelves" },
    { url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=200&fit=crop", description: "3. Open book pages" },
    { url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=200&h=200&fit=crop", description: "4. Bookshelf colorful" },
    { url: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=200&h=200&fit=crop", description: "5. Reading glasses books" },
    { url: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=200&h=200&fit=crop", description: "6. Vintage books" },
    { url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=200&fit=crop", description: "7. Books stacked artsy" },
    { url: "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=200&h=200&fit=crop", description: "8. E-reader and books" },
  ],

  // JEWELRY & WATCHES
  "jewelry-watches": [
    { url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop", description: "1. Modern watch" },
    { url: "https://images.unsplash.com/photo-1587925358603-c2eea5305bbc?w=200&h=200&fit=crop", description: "2. Luxury watch" },
    { url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop", description: "3. Gold jewelry" },
    { url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&h=200&fit=crop", description: "4. Diamond ring" },
    { url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200&h=200&fit=crop", description: "5. Necklace elegant" },
    { url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&h=200&fit=crop", description: "6. Bracelet" },
    { url: "https://images.unsplash.com/photo-1622398925373-3f91b1e275f5?w=200&h=200&fit=crop", description: "7. Smartwatch" },
    { url: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=200&h=200&fit=crop", description: "8. Watches collection" },
  ],

  // GARDEN & OUTDOOR
  "garden-outdoor": [
    { url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop", description: "1. Garden plants" },
    { url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop", description: "2. Green plants" },
    { url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=200&h=200&fit=crop", description: "3. Flower pots" },
    { url: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=200&h=200&fit=crop", description: "4. Outdoor furniture" },
    { url: "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=200&h=200&fit=crop", description: "5. BBQ grill" },
    { url: "https://images.unsplash.com/photo-1510227272981-87123e259b17?w=200&h=200&fit=crop", description: "6. Succulent plants" },
    { url: "https://images.unsplash.com/photo-1523301343968-6a6ebf63c672?w=200&h=200&fit=crop", description: "7. Patio setup" },
    { url: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=200&h=200&fit=crop", description: "8. Garden tools" },
  ],

  // AUTOMOTIVE
  "automotive": [
    { url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&h=200&fit=crop", description: "1. Sports car" },
    { url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=200&h=200&fit=crop", description: "2. Luxury car" },
    { url: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=200&h=200&fit=crop", description: "3. Engine parts" },
    { url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=200&h=200&fit=crop", description: "4. Car interior" },
    { url: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=200&h=200&fit=crop", description: "5. Tire wheel" },
    { url: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=200&h=200&fit=crop", description: "6. Classic car" },
    { url: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=200&h=200&fit=crop", description: "7. Modern car front" },
    { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop", description: "8. Car tools" },
  ],

  // COMPUTERS
  "computers": [
    { url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200&h=200&fit=crop", description: "1. Laptop keyboard" },
    { url: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=200&h=200&fit=crop", description: "2. Desktop setup" },
    { url: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=200&h=200&fit=crop", description: "3. PC components" },
    { url: "https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=200&h=200&fit=crop", description: "4. Macbook Air" },
    { url: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=200&h=200&fit=crop", description: "5. Gaming PC RGB" },
    { url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=200&h=200&fit=crop", description: "6. Monitor setup" },
    { url: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=200&h=200&fit=crop", description: "7. Keyboard mouse" },
    { url: "https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=200&h=200&fit=crop", description: "8. Graphics card" },
  ],

  // GROCERY
  "grocery": [
    { url: "https://images.unsplash.com/photo-1543168256-418811576931?w=200&h=200&fit=crop", description: "1. Fresh groceries" },
    { url: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop", description: "2. Fruits and veggies" },
    { url: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=200&h=200&fit=crop", description: "3. Farmers market" },
    { url: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=200&h=200&fit=crop", description: "4. Food flat lay" },
    { url: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=200&h=200&fit=crop", description: "5. Healthy food" },
    { url: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=200&h=200&fit=crop", description: "6. Grocery bags" },
    { url: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=200&h=200&fit=crop", description: "7. Pantry items" },
    { url: "https://images.unsplash.com/photo-1579113800032-c38bd7635818?w=200&h=200&fit=crop", description: "8. Fresh produce" },
  ],

  // HEALTH & WELLNESS
  "health-wellness": [
    { url: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=200&h=200&fit=crop", description: "1. Vitamins/supplements" },
    { url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop", description: "2. Pills and medicine" },
    { url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=200&h=200&fit=crop", description: "3. Medical supplies" },
    { url: "https://images.unsplash.com/photo-1571019613914-85f342c6a11e?w=200&h=200&fit=crop", description: "4. Health products" },
    { url: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=200&h=200&fit=crop", description: "5. Wellness items" },
    { url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop", description: "6. Yoga meditation" },
    { url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&h=200&fit=crop", description: "7. Essential oils" },
    { url: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=200&h=200&fit=crop", description: "8. Herbal tea" },
  ],

  // SMART HOME
  "smart-home": [
    { url: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=200&h=200&fit=crop", description: "1. Smart speaker" },
    { url: "https://images.unsplash.com/photo-1558002038-1055907df827?w=200&h=200&fit=crop", description: "2. Smart home devices" },
    { url: "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=200&h=200&fit=crop", description: "3. Home assistant" },
    { url: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=200&h=200&fit=crop", description: "4. Smart thermostat" },
    { url: "https://images.unsplash.com/photo-1556741533-411cf82e4e2d?w=200&h=200&fit=crop", description: "5. Security camera" },
    { url: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200&h=200&fit=crop", description: "6. Robot vacuum" },
    { url: "https://images.unsplash.com/photo-1543791187-dda3e6f7d4e3?w=200&h=200&fit=crop", description: "7. Smart display" },
    { url: "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=200&h=200&fit=crop", description: "8. Smart lights" },
  ],

  // TOOLS
  "tools-home": [
    { url: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=200&h=200&fit=crop", description: "1. Tools on wall" },
    { url: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=200&h=200&fit=crop", description: "2. Power drill" },
    { url: "https://images.unsplash.com/photo-1505798577917-a65157d3320a?w=200&h=200&fit=crop", description: "3. Toolbox" },
    { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop", description: "4. Workbench tools" },
    { url: "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=200&h=200&fit=crop", description: "5. Screwdrivers set" },
    { url: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=200&h=200&fit=crop", description: "6. Hammer and nails" },
    { url: "https://images.unsplash.com/photo-1580901368919-7738efb0f87e?w=200&h=200&fit=crop", description: "7. Measuring tape" },
    { url: "https://images.unsplash.com/photo-1562408590-e32931084e23?w=200&h=200&fit=crop", description: "8. Wrenches" },
  ],

  // MOVIES & MUSIC - NEW OPTIONS
  "movies-music": [
    { url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop", description: "1. Vinyl records" },
    { url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&h=200&fit=crop", description: "2. Music headphones" },
    { url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=200&h=200&fit=crop", description: "3. Film clapperboard" },
    { url: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=200&h=200&fit=crop", description: "4. Cinema movie theater" },
    { url: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=200&h=200&fit=crop", description: "5. Old film projector" },
    { url: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=200&h=200&fit=crop", description: "6. Blu-ray DVD discs" },
    { url: "https://images.unsplash.com/photo-1504509546545-e000b4a62425?w=200&h=200&fit=crop", description: "7. Streaming TV remote" },
    { url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&h=200&fit=crop", description: "8. Concert lights" },
    { url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop", description: "9. DJ setup" },
    { url: "https://images.unsplash.com/photo-1571974599782-87624638275e?w=200&h=200&fit=crop", description: "10. Spotify playlist vibe" },
    { url: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=200&h=200&fit=crop", description: "11. VHS tapes retro" },
    { url: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=200&h=200&fit=crop", description: "12. Movie premiere red" },
  ],

  // MUSICAL INSTRUMENTS
  "musical-instruments": [
    { url: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=200&h=200&fit=crop", description: "1. Acoustic guitar" },
    { url: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=200&h=200&fit=crop", description: "2. Piano keys" },
    { url: "https://images.unsplash.com/photo-1558098329-a11cff621064?w=200&h=200&fit=crop", description: "3. Drum kit" },
    { url: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=200&h=200&fit=crop", description: "4. Electric guitar" },
    { url: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=200&h=200&fit=crop", description: "5. Violin" },
    { url: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=200&h=200&fit=crop", description: "6. Saxophone" },
    { url: "https://images.unsplash.com/photo-1552422535-c45813c61732?w=200&h=200&fit=crop", description: "7. Ukulele" },
    { url: "https://images.unsplash.com/photo-1461784121038-f088ca1e7714?w=200&h=200&fit=crop", description: "8. Microphone studio" },
  ],

  // COLLECTIBLES - NEW OPTIONS
  "collectibles": [
    { url: "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=200&h=200&fit=crop", description: "1. Pokemon trading cards" },
    { url: "https://images.unsplash.com/photo-1608889476518-738c9b1dcb40?w=200&h=200&fit=crop", description: "2. Vintage coins" },
    { url: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=200&h=200&fit=crop", description: "3. Comic books" },
    { url: "https://images.unsplash.com/photo-1594787317538-8fd77e30e2e1?w=200&h=200&fit=crop", description: "4. Funko Pop figures" },
    { url: "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=200&h=200&fit=crop", description: "5. Action figures shelf" },
    { url: "https://images.unsplash.com/photo-1608278047522-58806a6ac85b?w=200&h=200&fit=crop", description: "6. Retro toys vintage" },
    { url: "https://images.unsplash.com/photo-1618004652321-13a63e576b80?w=200&h=200&fit=crop", description: "7. Sports memorabilia" },
    { url: "https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=200&h=200&fit=crop", description: "8. Vintage camera" },
    { url: "https://images.unsplash.com/photo-1636487658547-c66ac0dbddfc?w=200&h=200&fit=crop", description: "9. Rare stamps" },
    { url: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=200&h=200&fit=crop", description: "10. Nintendo collectibles" },
    { url: "https://images.unsplash.com/photo-1563207153-f403bf289096?w=200&h=200&fit=crop", description: "11. Star Wars figures" },
    { url: "https://images.unsplash.com/photo-1558349699-1e1c38c05eeb?w=200&h=200&fit=crop", description: "12. LEGO collection" },
  ],

  // OFFICE & SCHOOL - NEW OPTIONS
  "office-school": [
    { url: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=200&h=200&fit=crop", description: "1. Office supplies flat" },
    { url: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=200&h=200&fit=crop", description: "2. Colorful pencils" },
    { url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&h=200&fit=crop", description: "3. Apple on books" },
    { url: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=200&h=200&fit=crop", description: "4. Backpack stylish" },
    { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop", description: "5. Clean desk setup" },
    { url: "https://images.unsplash.com/photo-1523289333742-be1143f6b766?w=200&h=200&fit=crop", description: "6. Colored markers" },
    { url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=200&h=200&fit=crop", description: "7. Classroom education" },
    { url: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=200&h=200&fit=crop", description: "8. Writing notes" },
    { url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop", description: "9. Study desk organized" },
    { url: "https://images.unsplash.com/photo-1568702846914-96b305d2uj34?w=200&h=200&fit=crop", description: "10. Notebook and pen" },
    { url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200&h=200&fit=crop", description: "11. Work from laptop" },
    { url: "https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=200&h=200&fit=crop", description: "12. Scissors and tape" },
  ],

  // HANDMADE
  "handmade": [
    { url: "https://images.unsplash.com/photo-1528396518501-b53b655eb9b3?w=200&h=200&fit=crop", description: "1. Handmade crafts" },
    { url: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200&h=200&fit=crop", description: "2. Pottery" },
    { url: "https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?w=200&h=200&fit=crop", description: "3. Knitting yarn" },
    { url: "https://images.unsplash.com/photo-1591312931371-7f6e72c8f3ea?w=200&h=200&fit=crop", description: "4. Handmade candles" },
    { url: "https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=200&h=200&fit=crop", description: "5. Handmade soap" },
    { url: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=200&h=200&fit=crop", description: "6. Macrame" },
    { url: "https://images.unsplash.com/photo-1461344577544-4e5dc9487184?w=200&h=200&fit=crop", description: "7. Craft supplies" },
    { url: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=200&h=200&fit=crop", description: "8. Fabric textiles" },
  ],

  // GIFT CARDS
  "gift-cards": [
    { url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&h=200&fit=crop", description: "1. Gift boxes" },
    { url: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=200&h=200&fit=crop", description: "2. Wrapped gifts" },
    { url: "https://images.unsplash.com/photo-1526666923127-b2970f64b422?w=200&h=200&fit=crop", description: "3. Gift ribbons" },
    { url: "https://images.unsplash.com/photo-1607469256872-48e588e58cf3?w=200&h=200&fit=crop", description: "4. Gift card design" },
    { url: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=200&h=200&fit=crop", description: "5. Present box" },
    { url: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=200&h=200&fit=crop", description: "6. Gift envelope" },
    { url: "https://images.unsplash.com/photo-1482330454287-9d4c7e14d2b4?w=200&h=200&fit=crop", description: "7. Surprise box" },
    { url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=200&h=200&fit=crop", description: "8. Gift wrapping" },
  ],
}

// Convert category names to display format
const categoryDisplayNames: Record<string, string> = {
  "home": "🏠 Home & Kitchen",
  "fashion": "👔 Fashion",
  "electronics": "📱 Electronics",
  "beauty": "💄 Beauty",
  "gaming": "🎮 Gaming",
  "sports": "⚽ Sports & Fitness",
  "toys": "🧸 Toys",
  "baby-kids": "👶 Baby & Kids",
  "pets": "🐕 Pets",
  "books": "📚 Books",
  "jewelry-watches": "💎 Jewelry & Watches",
  "garden-outdoor": "🌿 Garden & Outdoor",
  "automotive": "🚗 Automotive",
  "computers": "💻 Computers",
  "grocery": "🛒 Grocery",
  "health-wellness": "💊 Health & Wellness",
  "smart-home": "🏠 Smart Home",
  "tools-home": "🔧 Tools",
  "movies-music": "🎵 Movies & Music",
  "musical-instruments": "🎸 Musical Instruments",
  "collectibles": "🏆 Collectibles",
  "office-school": "📎 Office & School",
  "handmade": "✋ Handmade",
  "gift-cards": "🎁 Gift Cards",
}

export default function DemoPage() {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["home", "fashion", "electronics"]))
  const [selectedImages, setSelectedImages] = useState<Record<string, number>>({})
  const [copiedCategory, setCopiedCategory] = useState<string | null>(null)

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  }

  const selectImage = (category: string, index: number) => {
    setSelectedImages(prev => ({
      ...prev,
      [category]: index
    }))
  }

  const copyImageUrl = (category: string, url: string) => {
    navigator.clipboard.writeText(url)
    setCopiedCategory(category)
    setTimeout(() => setCopiedCategory(null), 2000)
  }

  // Generate the final code for category-circles.tsx
  const generateCode = () => {
    let code = "const categoryImages: Record<string, string> = {\n"
    Object.entries(selectedImages).forEach(([category, index]) => {
      const imageUrl = categoryImageOptions[category]?.[index]?.url
      if (imageUrl) {
        code += `  "${category}": "${imageUrl}",\n`
      }
    })
    code += "}"
    return code
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">🖼️ Category Image Selector</h1>
        <p className="text-gray-600 mb-6">
          Click on images to select the best one for each category. Selected images will be highlighted with a <span className="text-green-600 font-semibold">green border</span>.
        </p>

        {/* Quick Jump Links */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="font-semibold mb-2">Quick Jump:</h2>
          <div className="flex flex-wrap gap-2">
            {Object.keys(categoryImageOptions).map((category) => (
              <button
                key={category}
                onClick={() => {
                  setExpandedCategories(prev => new Set([...prev, category]))
                  document.getElementById(`category-${category}`)?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                {categoryDisplayNames[category] || category}
              </button>
            ))}
          </div>
        </div>

        {/* Category Sections */}
        <div className="space-y-4">
          {Object.entries(categoryImageOptions).map(([category, images]) => {
            const isExpanded = expandedCategories.has(category)
            const selectedIndex = selectedImages[category]

            return (
              <div 
                key={category} 
                id={`category-${category}`}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-semibold">
                      {categoryDisplayNames[category] || category}
                    </span>
                    {selectedIndex !== undefined && (
                      <span className="text-sm text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                        ✓ Image #{selectedIndex + 1} selected
                      </span>
                    )}
                  </div>
                  {isExpanded ? (
                    <CaretUp size={24} className="text-gray-400" />
                  ) : (
                    <CaretDown size={24} className="text-gray-400" />
                  )}
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-6 pb-6 border-t">
                    <p className="text-gray-500 text-sm mt-4 mb-4">
                      Click on an image to select it. The selected image will be used for the category circle on the homepage.
                    </p>
                    
                    {/* Image Grid - Circles like category component */}
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
                      {images.map((image, index) => {
                        const isSelected = selectedIndex === index

                        return (
                          <div
                            key={index}
                            className="flex flex-col items-center gap-2"
                          >
                            <button
                              onClick={() => selectImage(category, index)}
                              className={cn(
                                "rounded-full overflow-hidden transition-all duration-200",
                                "size-16 sm:size-20",
                                "ring-2 hover:scale-105",
                                isSelected 
                                  ? "ring-green-500 ring-4 scale-105" 
                                  : "ring-gray-200 hover:ring-blue-400"
                              )}
                            >
                              <Image
                                src={image.url}
                                alt={image.description}
                                width={80}
                                height={80}
                                className="size-full object-cover"
                                unoptimized
                              />
                            </button>
                            <div className="text-center">
                              <span className={cn(
                                "text-xs font-medium",
                                isSelected ? "text-green-600" : "text-gray-600"
                              )}>
                                {image.description.split('. ')[0]}
                              </span>
                              {isSelected && (
                                <Check size={14} className="inline ml-1 text-green-500" />
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Copy URL Button */}
                    {selectedIndex !== undefined && (
                      <div className="mt-4 flex items-center gap-2">
                        <code className="bg-gray-100 px-3 py-1 rounded text-sm flex-1 truncate">
                          {images[selectedIndex].url}
                        </code>
                        <button
                          onClick={() => copyImageUrl(category, images[selectedIndex].url)}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                        >
                          {copiedCategory === category ? (
                            <>
                              <Check size={14} />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy size={14} />
                              Copy URL
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Selected Images Summary */}
        {Object.keys(selectedImages).length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow p-6 sticky bottom-4">
            <h2 className="text-xl font-semibold mb-4">✅ Selected Images Summary ({Object.keys(selectedImages).length} selected)</h2>
            <div className="flex flex-wrap gap-4 mb-4">
              {Object.entries(selectedImages).map(([category, index]) => {
                const image = categoryImageOptions[category]?.[index]
                if (!image) return null
                return (
                  <div key={category} className="flex items-center gap-2 bg-gray-50 rounded-full pr-3">
                    <div className="size-10 rounded-full overflow-hidden">
                      <Image
                        src={image.url}
                        alt={category}
                        width={40}
                        height={40}
                        className="size-full object-cover"
                        unoptimized
                      />
                    </div>
                    <span className="text-sm font-medium">{category}</span>
                  </div>
                )
              })}
            </div>
            
            {/* Generate Code Button */}
            <button
              onClick={() => {
                const code = generateCode()
                navigator.clipboard.writeText(code)
                alert("Code copied to clipboard! Paste it in category-circles.tsx")
              }}
              className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-lg"
            >
              📋 Copy Generated Code for category-circles.tsx
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
