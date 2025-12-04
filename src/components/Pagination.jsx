import { Pagination, Stack, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const ResponsivePagination = ({ page, count, onChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div className="d-flex justify-content-center mt-4">
      <Stack spacing={2}>
        <Pagination
          count={count} // total number of pages
          page={page}   // current page
          onChange={onChange}
          variant="outlined"
          shape="rounded"
          color="primary"
          size={isMobile ? "small" : "medium"}
          showFirstButton
          showLastButton
        />
      </Stack>
    </div>
  );
};

export default ResponsivePagination