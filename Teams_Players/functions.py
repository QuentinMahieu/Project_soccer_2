import pandas as pd

path_2020 = "Team_player_data/raw/players_20.csv"

def cleanup(df):
    df["Teams"] = df["Teams"].str.replace("RC Celta", "RC Celta Vigo")
    df["Teams"] = df["Teams"].str.replace("Real Sporting de Gijón", "Sporting Gijón")
    df["Teams"] = df["Teams"].str.replace("Athletic Club de Bilbao", "Athletic Club Bilbao")
    df["Teams"] = df["Teams"].str.replace("Deportivo de La Coruña", "RCD La Coruña")
    df["Teams"] = df["Teams"].str.replace("Milan", "AC Milan")
    df["Teams"] = df["Teams"].str.replace("Lazio", "SS Lazio")
    df["Teams"] = df["Teams"].str.replace("Fiorentina", "ACF Fiorentina")
    df["Teams"] = df["Teams"].str.replace("Inter", "FC Internazionale Milano")
    df["Teams"] = df["Teams"].str.replace("Sassuolo", "Sassuolo Calcio")
    df["Teams"] = df["Teams"].str.replace("Chievo Verona", "AC Chievo Verona")
    df["Teams"] = df["Teams"].str.replace("Roma", "AS Roma")
    df["Teams"] = df["Teams"].str.replace("Udinese", "Udinese Calcio")
    df["Teams"] = df["Teams"].str.replace("Cagliari", "Cagliari Calcio")
    df["Teams"] = df["Teams"].str.replace("Crotone", "FC Crotone")
    return df

def playersfunc(filepath,year):
    players_df = pd.read_csv(filepath)
    players_df = players_df[['short_name','age','height_cm','weight_kg','nationality','club','value_eur','overall',"wage_eur"]]
    players_df = players_df.rename({"club":"Teams"},axis=1)
    f = {"age":"mean", "height_cm":"mean","weight_kg":"mean","overall":"mean","value_eur":"mean","wage_eur":"mean"}
    players_df = players_df.groupby("Teams").agg(f)
    players_df["Year"]= int(year)
    players_df = players_df.reset_index()
    return cleanup(players_df)

playersfunc(path_2020,2020)