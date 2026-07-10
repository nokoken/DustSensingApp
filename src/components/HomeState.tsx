import {useEffect ,useState} from 'react'
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Stack,
    Typography,
} from "@mui/material";

async function fetchDustValueFromApi(): Promise<number> {
    const response = await fetch("/api/dust");

    if (!response.ok) {
        throw new Error("サーバーからデータを取得できませんでした。");
    }

    const data: unknown = await response.json();

    if (typeof data !== "number") {
        throw new Error("サーバーからnumber型以外のデータが返ってきました。");
    }

    return data;
}

function getDustMessage(value: number): string {
    if (value >= 70) {
        return "ほこり多めです。掃除した方がよさそうです。";
    }

    if (value >= 30) {
        return "普通くらいの状態です。";
    }

    return "空気はきれいです。";
}

function HomeState()
{
    const [dustValue, setDustValue] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        let isActive = true;

        const loadDustValue = async (): Promise<void> => {
        try {
            const value = await fetchDustValueFromApi();

            if (!isActive) {
            return;
            }

            setDustValue(value);
            setErrorMessage(null);
        } catch (error) {
            if (!isActive) {
            return;
            }

            if (error instanceof Error) {
            setErrorMessage(error.message);
            } else {
            setErrorMessage("不明なエラーが発生しました。");
            }
        } finally {
            if (isActive) {
            setIsLoading(false);
            }
        }
        };

        void loadDustValue();
         const timerId = window.setInterval(() => {
            void loadDustValue();
        }, 1000);

        return () => {
        isActive = false;
        };
    }, []);

    const handleReload = async (): Promise<void> => {
        try {
        setIsLoading(true);
        setErrorMessage(null);

        const value = await fetchDustValueFromApi();
        setDustValue(value);
        } catch (error) {
        if (error instanceof Error) {
            setErrorMessage(error.message);
        } else {
            setErrorMessage("不明なエラーが発生しました。");
        }
        } finally {
        setIsLoading(false);
        }
    };

    const dustMessage =
        dustValue === null ? "まだデータを取得していません。" : getDustMessage(dustValue);

    return (
        <>
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "grid",
                    placeItems: "center",
                    bgcolor: "#f5f5f5",
                    p: 2,
                }}
                >
                <Card sx={{ width: "100%", maxWidth: 480, borderRadius: 4 }}>
                    <CardContent>
                    <Stack spacing={3}>
                        <Box>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Dust Sensing App
                        </Typography>

                        <Typography color="text.secondary">
                            サーバーからnumber型の値を取得して、表示文言を切り替えます。
                        </Typography>
                        </Box>

                        {errorMessage !== null && (
                        <Alert severity="error">{errorMessage}</Alert>
                        )}

                        <Box>
                        <Typography variant="body1" color="text.secondary">
                            ほこり値
                        </Typography>

                        <Typography variant="h2" component="p">
                            {dustValue ?? "-"}
                        </Typography>
                        </Box>

                        <Alert
                        severity={
                            dustValue === null
                            ? "info"
                            : dustValue >= 70
                                ? "warning"
                                : dustValue >= 30
                                ? "info"
                                : "success"
                        }
                        >
                        {dustMessage}
                        </Alert>

                        <Button
                        variant="contained"
                        onClick={handleReload}
                        disabled={isLoading}
                        >
                        {isLoading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            "サーバーから再取得"
                        )}
                        </Button>
                    </Stack>
                    </CardContent>
                </Card>
                </Box>
        </>
    )
}

export default HomeState