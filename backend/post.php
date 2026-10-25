<?php
// class Post {
//     private $conn;
//     private $table_name;
    
    // الخصائص
//     public $title;
//     public $content;
//     public $author;
//     public $tags;
//     public $categories = [];
//     public $published = true;
//     public $main = false;
//     public $photographer = false;
//     public $block = false;
//     public $inLast = false;
//     public $topmain = false;
    
//     // Constructor
//     public function __construct($db) {
//         $this->conn = $db;
//         $this->table_name = 'post'; // جدول افتراضي
//     }
    
//     // دالة لتعيين اسم الجدول
//     public function setTableName($table_name) {
//         $this->table_name = $table_name;
//     }
    
//     // دالة إنشاء المقال
//     public function create() {
//         try {
//             // استعلام الإدخال
//             $query = "INSERT INTO " . $this->table_name . " 
//                      (title, content, author, tags, published, main, photographer, block, inLast, topmain, created_at) 
//                      VALUES 
//                      (:title, :content, :author, :tags, :published, :main, :photographer, :block, :inLast, :topmain, NOW())";
            
//             // تحضير الاستعلام
//             $stmt = $this->conn->prepare($query);
            
//             // تنظيف البيانات
//             $this->title = htmlspecialchars(strip_tags($this->title));
//             $this->content = htmlspecialchars(strip_tags($this->content));
//             $this->author = htmlspecialchars(strip_tags($this->author));
//             $this->tags = htmlspecialchars(strip_tags($this->tags));
            
//             // ربط القيم
//             $stmt->bindParam(":title", $this->title);
//             $stmt->bindParam(":content", $this->content);
//             $stmt->bindParam(":author", $this->author);
//             $stmt->bindParam(":tags", $this->tags);
//             $stmt->bindParam(":published", $this->published);
//             $stmt->bindParam(":main", $this->main);
//             $stmt->bindParam(":photographer", $this->photographer);
//             $stmt->bindParam(":block", $this->block);
//             $stmt->bindParam(":inLast", $this->inLast);
//             $stmt->bindParam(":topmain", $this->topmain);
            
//             // تنفيذ الاستعلام
//             if ($stmt->execute()) {
//                 $post_id = $this->conn->lastInsertId();
                
//                 return [
//                     'status' => 'success',
//                     'post_id' => $post_id,
//                     'table' => $this->table_name,
//                     'message' => 'تم إنشاء المقال بنجاح في ' . $this->table_name
//                 ];
//             } else {
//                 return [
//                     'status' => 'error',
//                     'message' => 'فشل في إنشاء المقال'
//                 ];
//             }
            
//         } catch (PDOException $exception) {
//             return [
//                 'status' => 'error',
//                 'message' => $exception->getMessage()
//             ];
//         }
//     }
// }
?>