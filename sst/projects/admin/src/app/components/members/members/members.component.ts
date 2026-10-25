import { Component } from '@angular/core';

interface Member {
  id: number;
  name: string;
  pass: string;
  email: string;
}

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent {
  members: Member[] = [
    { id: 1, name: 'المدير', pass: '******', email: 'admin@example.com' },
    { id: 2, name: 'محمد', pass: '123456', email: 'mohammed@gmail.com' },
    { id: 3, name: 'أحمد', pass: 'abcdef', email: 'ahmad@yahoo.com' },
  ];

  addMember() {
    alert('🧑‍💻 إضافة عضو جديد (قيد التطوير)');
  }

  editMember(id: number) {
    alert(`✏️ تعديل العضو رقم ${id}`);
  }

  deleteMember(id: number) {
    if (confirm('هل أنت متأكد أنك تريد حذف هذا العضو؟')) {
      this.members = this.members.filter(m => m.id !== id);
    }
  }
}
