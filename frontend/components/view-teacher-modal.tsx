import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Teacher } from "./teacher-table";

interface ViewTeacherModalProps {
  teacher: Teacher;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export function ViewTeacherModal({ teacher, isOpen, onClose, onEdit }: ViewTeacherModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{teacher.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <p>Email: {teacher.email}</p>
          <p>Отделение: {teacher.department}</p>
          <p>Должность: {teacher.role}</p>
          <p>Статус: {teacher.status}</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Закрыть
          </Button>
          <Button onClick={onEdit}>Редактировать</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}