import React from "react";
import Card from "react-bootstrap/Card"

export interface TopicCardProps
{
    header: string,
    body: string,
    link?: string
    onClick: (event: any) => void;
}

const TopicCard: React.FC<TopicCardProps> = ({header, body, link, onClick}) => {
    return (
    <div onClick={onClick} className="h-full">
        <Card bg="dark" text="white" style={{ width: '25rem', height: '300px'}}>
            <Card.Body>
                <Card.Title className="mb-2">{header}</Card.Title>
                <Card.Subtitle className="mb-5">0 / 0</Card.Subtitle>
                <Card.Text>
                {body}
                </Card.Text>
                {link && <Card.Link href={link}>Learn More</Card.Link>}
            </Card.Body>
        </Card>
    </div>
    )
}

export default TopicCard;