import { Button, Checkbox, FormControlLabel, MenuItem, Paper, Popper, Select, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
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
    canBeConsideredExpense: boolean, 
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

  const [tagName, setTagName] = useState<string>("");
  const [keywords, setKeywords] = useState<string>("");
  const [selectedTagCategoryId, setSelectedTagCategoryId] = useState<string>();
  const [isExpense, setIsExpense] = useState<boolean>(true);

  useEffect(() => {
    if(tag){
      setTagName(tag.name);
      setKeywords(tag.keywords.join(", "));
      // setCanBeConsideredExpense(tag.canBeCountedAsExpense);
    }else{
      setTagName("");
      setKeywords("");
    }
  }, []);


  const processKeywords = ()  => {
    const value : string[] = keywords
        .split(",") 
        .map((tag) => tag.trim()) 
        .filter((tag) => tag !== "");
    return value;
  }

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsExpense(event.target.checked);
  }

  const handleSave = () => {
        if (tag) {
            onEdit?.(
                {
                    ...tag,
                    name: tagName,
                    keywords: keywords.split(",").map((kw) => kw.trim()),
                    // isExpense,
                },
                expense.id ?? ''
            );
        } else {
            onCreate(tagName, keywords.split(",").map((kw) => kw.trim()), isExpense, expense.id ?? '', selectedTagCategoryId);
        }
  };

  const handleExistingTagUpdate = () => {

  }

  

  // const onExistingTagChange = (name: string) => {
  //   const tag = tags.find((tag) => tag.name === name);
  //   console.log('tag', tag);
  //   if(tag){
  //     setSelectedExistingTag(tag);
  //   }
  // }

  return (
    <Popper className={clazzName} open={open} anchorEl={anchorEl} placement="bottom-start">
      <Paper 
        className="paper"
        style={{ padding: 16, width: 200 }}
      > 
        <SelectExistingTag 
          tags={tags} 
          expense={expense}
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