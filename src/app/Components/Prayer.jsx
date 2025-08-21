import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

export default function MediaCard({name,time,image}) {
    return (
        <Card sx={{ 
            maxWidth: 345, 
            backgroundColor: 'rgba(255, 255, 255, 0.1)', 
            backdropFilter: 'blur(5px)',  
            borderRadius: '10px',   
            border: '1px solid rgba(255, 255, 255, 0.3)',
        }}>
            <CardMedia
                sx={{ height: 140 }}
                image={image}
                title="green iguana"
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div" sx={{ color: 'white' }}>
                    {name}
                </Typography>
                <Typography variant="h2" sx={{ color: 'white' }}>
                    {time}
                </Typography>
            </CardContent>
        </Card>
    );
}