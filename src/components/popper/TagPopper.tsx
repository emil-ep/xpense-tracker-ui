import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Tab, Tabs, Typography } from "@mui/material";
import './tagPopper.css'
import { useEffect, useId, useState } from "react";
import { ExpenseItemType, Tag, TagCategory } from "../../api/ApiResponses";
import SelectExistingTag from "./SelectExistingTag";
import CreateNewTag from "./CreateNewTag";


interface TagPopupProps {
  tag?: Tag | null;
  expense: ExpenseItemType;
  tagCategories: TagCategory[];
  tags: Tag[];
  open: boolean;
  onClose: () => void;
  onSelectExistingTag: (tag: Tag) => Promise<void>;
  onCreate: (
    tagName: string, 
    keywords: string[], 
    expenseId: string, 
    selectedTagCategoryId: string | undefined) => void;
  onEdit?: (updatedTag: Tag, expenseId: string) => void; 
}

const TagPopper: React.FC<TagPopupProps> = (
  { tag,
    expense, 
    tagCategories,
    open, 
    onClose, 
    onSelectExistingTag,
    onCreate, 
    onEdit,
    tags
  }) => {
  const [activeTab, setActiveTab] = useState(tag ? 1 : 0);
  const dialogId = useId().replace(/:/g, "");

  useEffect(() => {
    if (open) setActiveTab(tag ? 1 : 0);
  }, [open, tag]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      aria-labelledby={`${dialogId}-title`}
      aria-describedby={`${dialogId}-description`}
      PaperProps={{ className: "tagDialogPaper" }}
    >
      <DialogTitle id={`${dialogId}-title`} sx={{ pb: 1 }}>
        {tag ? "Edit tag" : "Add a tag to this expense"}
      </DialogTitle>
      <DialogContent dividers>
        <Typography id={`${dialogId}-description`} color="text.secondary" sx={{ mb: 2 }}>
          Choose an existing tag or create a new one. You can manage keywords before saving.
        </Typography>
        <Tabs
          value={activeTab}
          onChange={(_, value: number) => setActiveTab(value)}
          aria-label="Tag actions"
          variant="fullWidth"
        >
          <Tab id={`${dialogId}-existing-tab`} aria-controls={`${dialogId}-existing-panel`} label="Existing tag" />
          <Tab id={`${dialogId}-create-tab`} aria-controls={`${dialogId}-create-panel`} label={tag ? "Edit tag" : "Create new"} />
        </Tabs>
        <Box
          role="tabpanel"
          id={`${dialogId}-existing-panel`}
          aria-labelledby={`${dialogId}-existing-tab`}
          hidden={activeTab !== 0}
          sx={{ pt: 2 }}
        >
          <SelectExistingTag
            tags={tags}
            expense={expense}
            onSelect={onSelectExistingTag}
          />
        </Box>
        <Box
          role="tabpanel"
          id={`${dialogId}-create-panel`}
          aria-labelledby={`${dialogId}-create-tab`}
          hidden={activeTab !== 1}
          sx={{ pt: 2 }}
        >
          <CreateNewTag
            tagCategories={tagCategories}
            expense={expense}
            tag={tag}
            onEdit={onEdit}
            onCreate={onCreate}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TagPopper;