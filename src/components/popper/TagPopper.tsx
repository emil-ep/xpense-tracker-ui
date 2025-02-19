import { Button, Paper, Popper, Stack} from "@mui/material";
import './tagPopper.css'
import { ExpenseItemType, Tag, TagCategory } from "../../api/ApiResponses";
import SelectExistingTag from "./SelectExistingTag";
import CreateNewTag from "./CreateNewTag";


interface TagPopupProps {
  clazzName: string;
  tag?: Tag | null;
  expense: ExpenseItemType;
  tagCategories: TagCategory[];
  tags: Tag[];
  anchorEl: HTMLElement | null; 
  open: boolean;
  onClose: () => void;
  onCreate: (
    tagName: string, 
    keywords: string[], 
    expenseId: string, 
    selectedTagCategoryId: string | undefined) => void;
  onEdit?: (updatedTag: Tag, expenseId: string) => void; 
}

const TagPopper: React.FC<TagPopupProps> = (
  { clazzName, 
    tag, 
    expense, 
    tagCategories, 
    anchorEl, 
    open, 
    onClose, 
    onCreate, 
    onEdit,
    tags
  }) => {

  return (
    <Popper className={clazzName} open={open} anchorEl={anchorEl} placement="bottom-start">
      <Paper 
        className="paper"
        style={{ padding: 16, width: 200 }}
      > 
        <SelectExistingTag 
          tags={tags} 
          expense={expense}
          onClose={onClose ?? (() => {})}
        />
        <Stack alignItems="center">
          <h2>OR</h2>
        </Stack>
        <CreateNewTag
          tagCategories={tagCategories}
          expense={expense}
          tag={tag}
          onEdit={onEdit}
          onCreate={onCreate}
        />
        <Button onClick={onClose}>Cancel</Button>
      </Paper>
    </Popper>
  );
};

export default TagPopper;