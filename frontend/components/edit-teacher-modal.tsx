import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Teacher } from "./teacher-table";

interface EditTeacherModalProps {
  teacher: Teacher;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTeacher: Teacher) => void;
}

export function EditTeacherModal({ teacher, isOpen, onClose, onSave }: EditTeacherModalProps) {
  const [formData, setFormData] = useState(teacher);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const updatedTeacher = {
      ...formData,
      name: `${formData.lastName} ${formData.firstName} ${formData.middleName || ""}`.trim(),
    };
    onSave(updatedTeacher);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактировать преподавателя</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Фамилия"
          />
          <Input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Имя"
          />
          <Input
            name="middleName"
            value={formData.middleName || ""}
            onChange={handleChange}
            placeholder="Отчество"
          />
          <Input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <Input
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="Отделение"
          />
          <Input
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="Должность"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={handleSubmit}>Сохранить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}