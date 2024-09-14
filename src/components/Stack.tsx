import React from 'react';
import styled from 'styled-components';

interface StackProps extends React.HTMLProps<HTMLDivElement> {
  direction?: 'row' | 'column';
  spacing?: string;
  align?: 'flex-start' | 'center' | 'flex-end' | 'baseline' | 'stretch';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  className?: string;
}

const Stack: React.FC<StackProps> = ({
  children,
  direction = 'column',
  spacing,
  align = 'stretch',
  justify = 'flex-start',
  className,
  ...rest
}) => {
  return (
    <StyledStack 
      direction={direction} 
      spacing={spacing} 
      align={align} 
      justify={justify} 
      className={className}
      {...rest}
    >
      {children}
    </StyledStack>
  );
};

const StyledStack = styled.div<Pick<StackProps, 'direction' | 'spacing' | 'align' | 'justify'>>`
  display: flex;
  flex-direction: ${(props) => props.direction};
  gap: ${(props) => props.spacing};
  align-items: ${(props) => props.align};
  justify-content: ${(props) => props.justify};
`;

export default Stack;